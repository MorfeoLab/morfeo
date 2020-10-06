import {AfterContentChecked, AfterViewInit, Component, Input} from '@angular/core';
import {IFormElement} from '../../shared/models/form-element.model';
import {NgForm} from '@angular/forms';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {ValueService} from '../../shared/services/value/value.service';
import {EngDynamicFormsComponent} from '../../eng-dynamic-forms.component';


@Component({
  selector: 'mrf-datetime-element',
  templateUrl: './datetime-element.component.html',
  styleUrls: ['./datetime-element.component.scss'],
  viewProviders: [
    {
      provide: EngDynamicFormsComponent,
      useExisting: NgForm
    }
  ]
})
export class DatetimeElementComponent implements AfterViewInit, AfterContentChecked {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;

  /**
   * L'etichetta da rappresentare
   */
  public displayLabel: string;
  public displayLegend: string;

  /**
   * Conserviamo il precedente valore booleano di visibilità
   * per conoscere il momento in cui cambia
   */
  private componentWasVisible: boolean;
  valueNgModel: any = '';
  calcolatoEDisabilitato = false;

  constructor(
    private translatable: TranslatablePipe,
    private valueService: ValueService
  ) {
    if (!this.field) {
      return;
    }
    this.field.suffix = this.field.suffix || '';
    if (['date', 'time', 'datetime'].indexOf(this.field.datepickerMode) < 0) {
      this.field.datepickerMode = 'date';
    }
  }

  ngAfterViewInit() {
    /**
     * Calcolo l'etichetta da rappresentare in base ai valori di label e hideLabel
     */
    if (!!this.field.hideLabel) {
      this.displayLabel = '';
      this.displayLegend = null;
    } else {
      this.displayLabel = this.translatable.transform(this.field.label);
      this.displayLegend = this.translatable.transform(this.field.legend);
    }
    debugger;

    if (!!this.field.calculatedValue) {
      if (!!this.field.disabled) {
        this.calcolatoEDisabilitato = true;
      }
    }
    if (this.field.defaultValue) {
      setTimeout(() => {
        const defaultValue = {};
        defaultValue[this.field.key + this.field.suffix] = String(this.field.defaultValue);
        this.formRef.setValue(defaultValue);
      }, 10);
    }
    if ((!!this.field.input && !!this.field.disabled) || this.readOnly) {
      this.formRef.controls[this.field.key + this.field.suffix].valueChanges.subscribe(e => {
        this.valueNgModel = e !== undefined ? e : null;
      })
    }
    if (!!this.field.jsonLogic && !!this.field.jsonLogic.validate) {
      if (typeof this.field.jsonLogic.validate === 'string') {
        // 16/07/2020 la validazione dei campi con espressione regolare sull'idsemantico di tipo testo non funzionava
        // viene adesso introdotta la gestione con il campo pattern nativo
        // per evitare errori sul pregresso dovute a regole generate male sul BE introduco questo controllo
        // per cui in caso di regole definite in questo modo
        //   validate: '{"regex": ["^.*$", "{var:"NOME_CONTROLLO"}]}'
        // mi recupero l'espressione regolare in questo modo
        if (!!this.field.jsonLogic.validate.includes('regex')) {
          if (!this.field.validate) {
            this.field.validate = {};
          }
          try {
            const splitted = this.field.jsonLogic.validate.split('{"regex": ["');
            const splitted2 = splitted[1].split('", "{var:"');
            let regex = splitted2[0];
            this.field.validate.pattern = regex;
          } catch (e) {
            console.warn('Error on ' + this.field.key);
          }
        }
      }
    }
  }

  /**
   * Se l'elemento è nascosto deve perdere il valore
   */
  ngAfterContentChecked() {
    /// Se il componente è appena comparso ricarica il valore dal form
    const componentIsVisible = this.valueService.isVisible(this.field);
    const componentId = this.field.key + this.field.suffix;
    if (componentIsVisible) {
      if (!this.componentWasVisible) {
        /// Componente appena comparso
      }
    } else {
      if (this.componentWasVisible) {
        /// Componente appena nascosto
        const componentCount = this.valueService.visibleCount;
        if (!componentCount[componentId]) {
          /// Non ci sono altri controlli con lo stesso nome
          if (this.formRef.controls.hasOwnProperty(componentId)) {
            this.formRef.controls[componentId].setValue(null, {
              onlySelf: true,
              emitEvent: false
            });
          }
        }
      }
    }
    this.componentWasVisible = !!componentIsVisible;
  }

}
