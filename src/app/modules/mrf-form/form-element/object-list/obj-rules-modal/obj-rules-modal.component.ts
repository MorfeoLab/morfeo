import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {IForm} from '../../../shared/models/form-element.model';
import {FormContainerConfig, MrfFormComponent} from '../../../mrf-form.component';
import {NgForm} from '@angular/forms';
import {JsonLogicNode} from '../../json-rule-element/json-rule-element.component';
import {DataService} from '../../../shared/services/data/data.service';
import {debounceTime, map} from 'rxjs/operators';
import {UtilityService} from '../../../shared/services/utility/utility.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'mrf-obj-rules-modal',
    templateUrl: './obj-rules-modal.component.html',
    styleUrls: ['./obj-rules-modal.component.scss']
})
export class ObjRulesModalComponent implements AfterViewInit {

    public form: IForm;
    formConfig: FormContainerConfig;

    private formRef: NgForm;
    private idProgettoCambiamento: string;
    private filteredOptions: any[];
    public defaultValueRadioButton = 'true';

    @ViewChild(MrfFormComponent, {static: false}) private formContainer: MrfFormComponent;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ObjRulesModalComponent>,
        private dataService: DataService,
        private utility: UtilityService
    ) {
        this.formConfig = {
            showReset: true,
            resetIcon: 'delete',
            resetLabel: 'generic.buttons.cancel',
            resetCallback: () => {
                this.closeDialog();
            },
            showSubmit: true,
            submitIcon: 'save',
            submitLabel: 'generic.buttons.save',
            submitCallback: () => {
                this.createRule();
            }
        };
        let dataSrcValue = 'values';
        if (this.data.parentField) {
            if (this.data.parentField.dataSrc) {
                dataSrcValue = this.data.parentField.dataSrc;
            }
            this.form = {
                components: [
                    {
                        type: 'jsonRule',
                        key: 'rule',
                        dataSrc: dataSrcValue as 'url' | 'values' | 'resource'
                    }
                ]
            };

            if (this.data.parentField.dataSrc === 'url') {
                this.utility.getJsonElementByKey(this.form, 'rule').data = JSON.parse(JSON.stringify(this.data.parentField.data));
            }
        }
    }

    createRule() {
        if (typeof this.formRef.value.rule === 'string') {
            this.formRef.value.rule = JSON.parse(this.formRef.value.rule);
        }
        // Aggiungo la negazione perché l'utente sta regolando la visibilità mentre noi salviamo hidden
        this.data.element.rule = JSON.stringify([{'!': this.formRef.value.rule}]);
        this.dialogRef.close('ok');
    }

    salvaOpzione() {
        this.formRef.reset();
        this.data.element.rule = this.defaultValueRadioButton;
        this.dialogRef.close('ok');
    }

    closeDialog() {
        this.dialogRef.close('ko');
    }

    ngAfterViewInit() {
        if (!!this.formContainer) {
            this.formContainer.formReadyEvent.subscribe(f => {
                this.formRef = f;
                if (!!this.data.element.rule) {
                    /// Rimuovo la negazione
                    let rule = this.data.element.rule;
                    if (rule !== 'true' && rule !== 'false') {
                        // case json
                        if (typeof rule === 'string') {
                            rule = JSON.parse(rule);
                        }
                        if (Array.isArray(rule) && rule.length > 0) {
                            if ((rule[0] as JsonLogicNode).hasOwnProperty('!')) {
                                rule = rule[0]['!'];
                            }
                        }
                        if (!!this.data.jsonRuleService) {
                            this.formRef.controls.rule.valueChanges.pipe(
                                debounceTime(250),
                                map(value => {
                                    this.applyFilter(value);
                                })
                            ).subscribe();
                        }
                        this.formRef.setValue({
                            rule
                        });
                        this.defaultValueRadioButton = 'json';
                    } else {
                        // case true o false
                        this.defaultValueRadioButton = rule;
                    }
                }
            });
        }
    }

    applyFilter(filtro: string) {
        const filterFields: any = {};
        if (filtro !== undefined && filtro.length > 2) {
            filterFields.codice = filtro.toLowerCase();
            filterFields.idProgettoCambiamento = this.idProgettoCambiamento;
            this.data.getPaginatedList(0, 30, undefined, undefined, filterFields).subscribe(
                (data: any) => {
                    this.filteredOptions = data.elements.map(i => i.morfeoJson);
                }
            );
            this.formRef.setValue(this.filteredOptions);
        }
    }
}
