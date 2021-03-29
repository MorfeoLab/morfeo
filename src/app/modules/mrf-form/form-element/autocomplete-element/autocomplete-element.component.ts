import {AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {DataService} from '../../shared/services/data-service/data-service.service';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {IFormElement, IFormOptions} from '../../shared/models/form-element.model';
import {ResetOnChangeService} from '../../shared/services/reset-on-change.service';
import {MapToService} from '../../shared/services/map-to.service';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
  selector: 'mrf-autocomplete-element',
  templateUrl: './autocomplete-element.component.html',
  styleUrls: ['./autocomplete-element.component.scss']
})
export class AutocompleteElementComponent implements OnInit, AfterViewChecked, AfterContentChecked {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;
  filteredOptions: Observable<any[]>;
  array: any[] = [];
  suffix: string;
  subscription;
  myControl = new FormControl();
  options: any[];

  private valueField = 'value';
  private labelField = 'label';

  public displayLabel: string;
  public displayLegend: string;

  /**
   * Conserviamo il precedente valore booleano di visibilità
   * per conoscere il momento in cui cambia
   */
  private componentWasVisible: boolean;

  constructor(
    public dataService: DataService,
    private translatable: TranslatablePipe,
    private change: ChangeDetectorRef,
    private resetOnChangeService: ResetOnChangeService,
    private mapToService: MapToService,
    private valueService: ValueService
  ) {
  }

  ngOnInit() {
    if (!this.field) {
      return;
    }
    this.valueField = this.field.valueProperty || this.valueField;
    this.labelField = this.field.labelProperty || this.labelField;
    this.field.valueProperty = this.valueField;
    this.field.labelProperty = this.labelField;
    this.field.suffix = this.field.suffix || '';

    if (!!this.field.hideLabel) {
      this.displayLabel = '';
      this.displayLegend = null;
    } else {
      this.displayLabel = this.translatable.transform(this.field.label);
      this.displayLegend = this.translatable.transform(this.field.legend);
    }
    if (!!this.field.data && !!this.field.data.configurableParams) {
      const configurableParams = this.field.data.configurableParams;
      Object.keys(configurableParams).forEach(v => {
        if (configurableParams[v] !== '') {
          this.resetOnChangeService.registerRule(configurableParams[v], this.field.key);
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    if (!this.formRef) {
      return;
    }
    this.myControl = this.formRef.controls[
    this.field.key + this.field.suffix
      ] as FormControl;
    this.manageComboElements();
  }

  /**
   * @method _filter
   * @description Add description
   * @param value Add description
   */
  private _filter(value: any | undefined): any[] {
    if (null === value) {
      return;
    }
    if (
      !this.field.data.autocompleteType ||
      this.field.data.autocompleteType !== 'server'
    ) {
      if (value === undefined) {
        return this.array.slice(0, 10);
      }
      let filterValue: string;
      if (typeof value === 'string') {
        filterValue = value.toLowerCase();
      } else if (value.hasOwnProperty('label')) {
        filterValue = value.label.toLowerCase();
      }
      return this.array
        .filter(option => option.label.toLowerCase().includes(filterValue))
        .slice(0, 10);
    }
  }

  /**
   * @method manageComboElements
   * @description Add description
   */
  manageComboElements() {
    if (!this.field) {
      return;
    }
    switch (this.field.dataSrc) {
      case 'url':
        /**
         * Bisogna caricare i dati da un servizio
         */
        this.manageUrlComboElement();
        break;
      case 'resource':
        // @todo al momento non lo supportiamo
        this.manageResourceComboElement();
        break;
      case 'values':
        this.manageValuesComboElement();
        break;
      default:
        this.options = this.field.data.values;
        /**
         * @TODO: nel caso in cui il componente è readOnly si arriva qui, invece
         */
        console.warn(`[AUTOCOMPLETE] ${this.field.key}: Unmanaged case ${this.field.dataSrc}`);
    }
    this.change.detectChanges();
  }

  private manageValuesComboElement() {
    this.options = this.field.data.values;
    this.filteredOptions = of(this.options);
  }

  // TODO - Implement method
  /**
   * @method manageResourceComboElement
   * @description Add description
   */
  private manageResourceComboElement() {
    console.warn(this.field.key + ' dataSrc:"resource"  currently unsupported!');
    this.options = [{response: true}];
  }

  /**
   * @method manageUrlComboElement
   * @description Add description
   */
  private manageUrlComboElement() {
    if (this.field.data.autocompleteType !== 'server') {
      /**
       * Caricheremo i dati una volta sola, all'inizio
       */
      if (!this.subscription) {
        const params = this.field.data.params || {};
        this.subscription = this.dataService
          .getResourceByMethod(this.field.data.url, this.field.data.method, params)
          .subscribe((data: IFormOptions[]) => {
            this.options = data;
            this.manageGetResourceResponse();
            this.filteredOptions = this.myControl.valueChanges.pipe(
              map(value => {
                return this._filter(value);
              })
            );
          });
      }
    } else {
      this.filteredOptions =
        this.filteredOptions ||
        this.myControl.valueChanges.pipe(
          debounceTime(250),
          map(value => {
            this.array = [];
            if (!!value && value.length > 2) {
              // con la nuova implementazione il campo data ha un campo params
              // il campo params contiene il nome del queryParam da appendere alla url
              const params = {...this.field.data.params} || {};
              const configurableParams = {...this.field.data.configurableParams} || {};
              // per retrocompatibilita aggiungo questo, ossia se il campo params non è valorizzato
              // allora uso la vecchia logica ossia append diretta del value alla url
              let url = this.field.data.url;
              if (Object.keys(params).length === 0) {
                url += value;
              } else {
                Object.keys(params).forEach(v => {
                  params[v] = value;
                });
                //
                this.dataService.mergeParams(params, configurableParams, this.formRef);
              }
              this.dataService
                .getResourceByMethod(url, this.field.data.method, params)
                .subscribe((data: IFormOptions[]) => {
                  this.options = data;
                  this.manageGetResourceResponse();
                });
              return this.array;
            }
          })
        );
    }
  }

  /**
   * @method manageGetResourceResponse
   * @description Routine after call DataService.getResource. Set array using options values
   */
  private manageGetResourceResponse() {
    let label;
    if (Array.isArray(this.options) && this.options.length) {
      this.options.forEach(option => {
        label = this.translatable.transform(option[this.labelField]);
        this.array.push({label, value: option[this.valueField]});
      });
    }
  }

  /**
   * Funzionalita che permette di settare i valori definiti nelle key dell'oggetto mapFieldToFormKey
   * come valore degli idSemantici
   * @param data è l'oggetto selezionato
   */
  public optionSelectedEvent(data: any) {
    this.mapToService.optionSelectedEvent(this.field, data.value, this.formRef, this.options);
  }

  /**
   * questo serve per svuotare l'autocomplete in caso l'utente non abbia effettivamente cliccato su una delle option
   * disponibili.
   * Il metodo viene eseguito sopo un timeout perchè è emerso che in form particolarmente complessi
   * il valore del campo this.formRef.form.value[this.field.key + this.field.suffix]
   * viene effettivamente settato dopo parecchi ms
   */
  public onBlur($event) {
    setTimeout(() => {
      if (typeof this.formRef.form.value[this.field.key + this.field.suffix] === 'string') {
        // $event.target.value = '';
        this.formRef.form.value[this.field.key + this.field.suffix] = null;
      }
    }, 250);
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
