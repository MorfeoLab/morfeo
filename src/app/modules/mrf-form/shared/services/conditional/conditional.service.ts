import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormConditional, IFormElement, IFormTableColumn} from '../../models/form-element.model';
import {UtilityService} from '../utility/utility.service';
import * as _jsonLogic from 'json-logic-js/logic';
import {Subscription} from 'rxjs';
import {ElementWrapperComponent} from '../../../form-element/element-wrapper/element-wrapper.component';

export const SCOPED_SUFFIX = ':++';

/**
 * Questo servizio deve occuparsi di gestire le condizioni
 * di visualizzazione dei controlli del form
 * Sostituisce ChangeEventService
 * Sostituisce IstanzaService
 * Sostituisce ClearFieldService
 */
@Injectable({
    providedIn: 'root'
})
export class ConditionalService {

    /// Evitare il lowerCase?
    public avoidLowerCase = false;

    // Tutte le regole di conditional sono registrate qui, form per form, field per field
    private rules: IFormConditionalRule[] = [];
    private jsonRules: IFormJsonRule[] = [];
    private previousValue: { [key: string]: any } = {};
    private formValue: any;

    /**
     * La sottoscrizione a valueChange del form è una mappa perché ogni form ha una sua subscription
     */
    private changeSubscription: {
        [key: string]: Subscription
    } = {};
    /**
     * L'intervallo per evitare di eseguire troppo in fretta la stessa cose
     */
    private changeTimeout;

    private logEnabled = false;

    constructor(
        private utils: UtilityService
    ) {

        // ridefinisco la funziona in perche' non funziona
        const jsonIn = (a, b) => {
            if (typeof a === 'string' && this.utils.isJSON(a)) {
                a = JSON.parse(a);
            }
            if (Array.isArray(a)) {
                for (const item of a) {
                    if (String(item).toLowerCase() === String(b).toLowerCase()) {
                        return true;
                    }
                }
            }
            return false;
        };
        _jsonLogic.add_operation('inSelectBoxes', jsonIn);

        const jsonRegex = (a, b) => {
            /**
             * Aggiunto flag "i" perchè tutti i valori sono passati in lower case ma alcune regexp sono scritte
             * tutte in UPPERCASE (per esempio la regexp dei codici fiscali)
             */
            a = new RegExp(a, 'i');
            if (this.utils.isNullOrUndefined(a) || this.utils.isNullOrUndefined(b)) {
                return false;
            }
            return b.match(a);
        };
        _jsonLogic.add_operation('regex', jsonRegex);

        const overrideEquals = (a, b) => {
            if (this.utils.isNullOrUndefined(a) || this.utils.isNullOrUndefined(b)) {
                return false;
            }
            if (a.hasOwnProperty('value')) {
                if (b.hasOwnProperty('value')) {
                    if (typeof a.value === 'string' && typeof b.value === 'string') {
                        return a.value.toLowerCase() === b.value.toLowerCase();
                    }
                }
                if (typeof a.value === 'string' && typeof b === 'string') {
                    return a.value.toLowerCase() === b.toLowerCase();
                }
                return this.utils.areObjectsEquivalent(a, b);
            }
            if (typeof a === 'string' && typeof b === 'string') {
                return a.toLowerCase() === b.toLowerCase();
            }
            return this.utils.areObjectsEquivalent(a, b);
        };
        _jsonLogic.add_operation('==', overrideEquals);

        const overrideNotEquals = (a, b) => {
            // Not Equal è il contrario di Equal
            return !overrideEquals(a, b);
        };
        _jsonLogic.add_operation('!=', overrideNotEquals);

        const overrideSum = (a, b) => {
            const parsedA = this.utils.numericValue(a);
            const parsedB = this.utils.numericValue(b);
            return parsedA + parsedB;
        };
        _jsonLogic.add_operation('+', overrideSum);

        const overrideGt = (a, b) => {
            const parsedA = this.utils.numericValue(a);
            const parsedB = this.utils.numericValue(b);
            return parsedA > parsedB;
        };
        _jsonLogic.add_operation('>', overrideGt);

        const overrideGtE = (a, b) => {
            const parsedA = this.utils.numericValue(a);
            const parsedB = this.utils.numericValue(b);
            return parsedA >= parsedB;
        };
        _jsonLogic.add_operation('>=', overrideGtE);

        const overrideLt = (a, b) => {
            const parsedA = this.utils.numericValue(a);
            const parsedB = this.utils.numericValue(b);
            return parsedA < parsedB;
        };
        _jsonLogic.add_operation('<', overrideLt);

        const overrideLtE = (a, b) => {
            const parsedA = this.utils.numericValue(a);
            const parsedB = this.utils.numericValue(b);
            return parsedA <= parsedB;
        };
        _jsonLogic.add_operation('<=', overrideLtE);

        const jsonNot = (a) => {
            return !a;
        };
        _jsonLogic.add_operation('not', jsonNot);

        const total = (a) => {
            a = a.split('##').join('.');
            const data = this.formValue;
            if (typeof a === 'undefined' || a === '' || a === null) {
                return data;
            }
            let tot = 0;
            for (const key in data) {
                if (key.startsWith(a + ':') && !!data[key] && !isNaN(data[key])) {
                    tot += +data[key];
                }
            }
            return tot;
        };
        _jsonLogic.add_operation('+=', total);

        /**
         * La funzione jsonGroup non calcola nulla ma si limita a raggruppare
         * più risultati e viene usata come le parentesi in una espressione.
         * Non può essere scritta sotto forma di arrow function perché
         * è necessario utilizzare genericamente arguments
         */
        function jsonGroup() {
            let op = arguments[0];
            while (Array.isArray(op)) {
                op = op[0];
            }
            return op;
        }

        _jsonLogic.add_operation('()', jsonGroup);

    }

    public applyJsonLogic(rule, data): boolean {
        return _jsonLogic.apply(rule, data);
    }

    /**
     * Applica le regole in formato FormIO o FormConditional
     * Mantenuto soltanto per retrocompatibilità
     * E.g.:
     * {
     *  show?: boolean | string;
     *  when?: string;
     *  eq?: boolean | string;
     *  json?: string | object;
     *  }
     */
    applyRules(conditionalRule: IFormConditionalRule) {
        for (const field of conditionalRule.fields) {
            for (const rule of field.rules) {
                let visibility = true;
                if (rule.when) {
                    visibility = !!rule.show;
                    if (
                        conditionalRule.form.value.hasOwnProperty(rule.when) &&
                        conditionalRule.form.value[rule.when] !== rule.eq
                    ) {
                        visibility = !visibility;
                    }
                } else if (rule.json) {
                    if (typeof rule.json === 'string') {
                        rule.json = JSON.parse(rule.json);
                    }
                    const data = {data: {...conditionalRule.externalData, ...conditionalRule.form.value}};
                    visibility = _jsonLogic.apply(rule.json, data);
                }
                rule.component.setVisibility(visibility);
            }
        }
    }

    /** Distrugge tutte le regole esistenti */
    purgeRules() {
        this.rules = [];
        this.jsonRules = [];
        this.previousValue = {};
        this.formValue = null;
    }

    registerForm(f: NgForm, externalData?: { [key: string]: any }) {
        let rule: IFormConditionalRule;
        for (rule of this.rules) {
            if (rule.form === f) {
                return;
            }
        }
        rule = {
            externalData: externalData || {},
            fields: [],
            form: f
        };
        this.rules.push(rule);
        f.valueChanges.subscribe(() => {
            this.applyRules(rule);
        });
    }

    /**
     * @method registerRule
     * @description Registers the form on input and add the conditional to the appopriate array
     */
    registerRule(
        form: NgForm,
        element: IFormElement,
        component: ElementWrapperComponent
    ) {
        this.registerForm(form);
        const ruleSet: IFormConditionalRule = this.getRulesByForm(form);
        if (!!ruleSet) {
            let ruleField: IFormConditionalRuleField;
            for (const rf of ruleSet.fields) {
                if (rf.name === element.key) {
                    ruleField = rf;
                    break;
                }
            }
            if (!ruleField) {
                ruleField = {
                    name: element.key,
                    rules: []
                };
                ruleSet.fields.push(ruleField);
            }

            const rule: IFormConditionalRuleFieldCondition = {
                ...element.conditional
            };
            rule.component = component;
            ruleField.rules.push(rule);
        }
    }

    /**
     * Registra una regola di tipo JsonLogic con una callback arbitraria
     */
    public registerJsonRule(
        form: NgForm,
        element: IFormElement | IFormTableColumn,
        jsonRule: string,
        externalData: { [key: string]: any },
        callback: (v: any) => void,
        attachEventToEachField: boolean = false
    ): void {
        if (!((element as IFormElement).input || (element as IFormTableColumn).value)) {
            /// Se il componente non è un componente di input non devo fare nulla
            return;
        }
        const emitters: string[] = [];
        if (attachEventToEachField) {
            const flatRuleObject = this.utils.flattenObject(JSON.parse(jsonRule));
            for (const key in flatRuleObject) {
                if (flatRuleObject.hasOwnProperty(key) && key.split('_')[0] === 'var') {
                    const scopedKey = flatRuleObject[key].split(':')[0] + ((element as IFormElement).suffix || '');
                    emitters.push(scopedKey);
                }
            }
        }
        const formRule = this.registerFormJsonRuleListener(form);
        formRule.rules.push({
            element,
            jsonRule,
            externalData,
            callback,
            emitters
        });
    }

    registerFormJsonRuleListener(f: NgForm) {
        f.name = f.name || this.utils.randomString(32);
        let rule;
        for (rule of this.jsonRules) {
            if (rule.form === f) {
                return rule;
            }
        }
        rule = {
            form: f,
            rules: []
        };
        this.jsonRules.push(rule);

        if (!!this.changeSubscription[f.name]) {
            this.changeSubscription[f.name].unsubscribe();
        }

        this.changeSubscription[f.name] = f.valueChanges.subscribe((v) => {
            this.formValue = v;
            if (!!this.changeTimeout) {
                clearInterval(this.changeTimeout);
            }
            this.changeTimeout = setTimeout(() => {
                if (!this.utils.areObjectsEquivalent(v, this.previousValue[f.name])) {
                    /// @todo: cambiando i valori di ExternalValue qui non entra mai
                    this.applyJsonRules(rule);
                    this.previousValue[f.name] = JSON.parse(JSON.stringify(v || {}));
                }
            }, 50);
        });

        return rule;
    }

    /**
     * Esegue una regole jsonLogic e richiama una eventuale callback
     */
    applyJsonRules(rule) {
        /**
         * Sostituisce tutti i puntini con un altro separatore su tutti i valori del form
         */
        const formValue = JSON.parse(JSON.stringify(rule.form.form.getRawValue() || {}));
        for (const r of rule.rules) {
            const formExternalValue = JSON.parse(JSON.stringify(r.externalData || {}));
            this.previousValue[rule.form.name] = this.previousValue[rule.form.name] || {};
            /**
             * Se suffix è undefined lo valorizziamo con stringa vuota.
             */
            r.element.suffix = r.element.suffix || '';

            const isValueRule = r.isValueRule || r.element.calculatedValue === r.jsonRule;
            r.isValueRule = isValueRule;
            if (r.jsonRule) {
                /**
                 * Per prima cosa controllo se questa regola deve essere applicata
                 * solo alla modifica di un numero limitato di campi e non ad ogni
                 * modifica del form
                 */
                let shouldApplyRule = true;
                const previousValue = JSON.parse(JSON.stringify(this.previousValue[rule.form.name] || {}));
                const currentValue = JSON.parse(JSON.stringify(rule.form.value || {}));
                const previousValueWasNull = this.utils.isNullOrUndefined(previousValue[r.element.key]);
                const currentValueIsNull = this.utils.isNullOrUndefined(currentValue[r.element.key]);
                const previousValueWithoutTargetField = {...previousValue, [r.element.key]: null};
                const currentValueWithoutTargetField = {...currentValue, [r.element.key]: null};
                if (
                    isValueRule &&
                    !this.utils.areObjectsEquivalent(previousValue, currentValue) &&
                    !!this.utils.areObjectsEquivalent(previousValueWithoutTargetField, currentValueWithoutTargetField) &&
                    (!previousValueWasNull && !currentValueIsNull)
                ) {
                    /// Se è stato modificato SOLO il valore del campo target allora la regola non va applicata
                    this.log(`Questa regola NON deve essere applicata perché il valore di "${r.element.key}" è cambiato. Prima era "${this.previousValue[rule.form.name][r.element.key]}" e adesso è "${rule.form.value[r.element.key]}"`, 'background: #FF0000; color: #FFFF00;');
                    shouldApplyRule = false;
                } else if (Array.isArray(r.emitters) && r.emitters.length > 0) {
                    shouldApplyRule = false;
                    /// Se devo reagire solo al cambiamento di alcuni emitter
                    for (const key of r.emitters) {
                        if (this.utils.isNullOrUndefined(this.previousValue[rule.form.name][key])) {
                            this.previousValue[rule.form.name][key] = null;
                        }
                        if (this.utils.isNullOrUndefined(rule.form.value[key])) {
                            if (!this.utils.isNullOrUndefined(r.externalData[key])) {
                                rule.form.value[key] = r.externalData[key];
                            } else {
                                rule.form.value[key] = null;
                            }
                        }
                        if (rule.form.value.hasOwnProperty(key)) {
                            this.log(rule.form.value[key], this.previousValue[rule.form.name][key]);
                            if (!this.utils.areObjectsEquivalent(rule.form.value[key], this.previousValue[rule.form.name][key])) {
                                this.log(`Questa regola deve essere applicata perché il valore di "${key}" è cambiato. Prima era "${this.previousValue[rule.form.name][key]}" e adesso è "${rule.form.value[key]}"`);
                                shouldApplyRule = true;
                            } else {
                                this.log(`Questa regola NON deve essere applicata perché il valore di "${key}" NON è cambiato. "${this.previousValue[rule.form.name][key]}" === "${rule.form.value[key]}"`);
                            }
                        }
                    }
                    if (!shouldApplyRule) {
                        this.log(`Questa regola non deve essere applicata a ${r.element.key} perché Emitters non è buono`);
                    }
                }
                if (shouldApplyRule) {
                    /**
                     * Sostituisce tutti i puntini con un altro separatore su tutti i valori esterni
                     */
                    const externalData = JSON.parse(JSON.stringify(r.externalData || {}));
                    if (typeof r.jsonRule === 'string') {
                        r.jsonRule = JSON.parse(r.jsonRule.split(SCOPED_SUFFIX).join(r.element.suffix));
                    } else {
                        r.jsonRule = JSON.parse(JSON.stringify(r.jsonRule).split(SCOPED_SUFFIX).join(r.element.suffix));
                    }
                    /**
                     * I valori letterali salvati da BDM sono sempre lowercase, per questo modifichiamo i valori del form perché siano anche loro lowercase
                     */
                    const lowerCaseValues = {};
                    const values = {...formExternalValue, ...externalData, ...formValue};
                    if (!this.avoidLowerCase) {
                        for (const key in values) {
                            if (values.hasOwnProperty(key)) {
                                lowerCaseValues[key] = this.utils.lowerCaseIfString(values[key]);
                            }
                        }
                    }
                    const result = _jsonLogic.apply(r.jsonRule, (this.avoidLowerCase ? values : lowerCaseValues));
                    r.callback(result);
                } else {
                    this.log(`Questa regola non è stata applicata a ${r.element.key}`);
                }
            }
        }
    }

    /**
     * @method getRulesByForm
     * @description Get the rules array for the selected form.
     */
    private getRulesByForm(f: NgForm): IFormConditionalRule {
        for (const rule of this.rules) {
            if (rule.form === f) {
                return rule;
            }
        }
        return null;
    }

    get jsonLogic() {
        return _jsonLogic;
    }

    public applyAllJsonRules() {
        for (const formRule of this.jsonRules) {
            this.applyJsonRules(formRule);
        }
    }

    private log(msg: string, style: string = 'color: red;') {
        if (this.logEnabled) {
            console.log(`%c${msg}`, style);
        }
    }
}

export interface IFormJsonRule {
    form: NgForm;
    rules: any[];
}

export interface IFormConditionalRule {
    externalData?: { [key: string]: any };
    form: NgForm;
    fields: IFormConditionalRuleField[];
}

export interface IFormConditionalRuleField {
    name: string;
    rules: IFormConditionalRuleFieldCondition[];
}

export interface IFormConditionalRuleFieldCondition extends IFormConditional {
    component?: ElementWrapperComponent;
}
