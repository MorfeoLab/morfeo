import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {Observable, of, Subscription} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {IFormElement, IFormOptions} from '../../shared/models/form-element.model';
import {DataService} from '../../shared/services/data-service/data-service.service';
import {ResetOnChangeService} from '../../shared/services/reset-on-change.service';
import {MapToService} from '../../shared/services/map-to.service';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipList} from '@angular/material/chips';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
  selector: 'mrf-chips-element',
  templateUrl: './chips-element.component.html',
  styleUrls: ['./chips-element.component.scss']
})
export class ChipsElementComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked {

  /**
   * Riferimento diretto all'input, utilizzato in onEnter()
   */

  @ViewChild('textInput') textInput;
  /**
   * Modello JSON per il disegno del campo
   */
  @Input() field: IFormElement;


  @Input() readOnly: boolean;

  /**
   * Riferimento al form che contiene questo controllo
   */
  @Input() formRef: NgForm;

  /**
   * EventEmitter per i controlli globali
   */
  @Output() change = new EventEmitter();
  @Output() changeGlobal = new EventEmitter();

  /**
   * Le chip possono essere selezionate
   */
  public selectable = true;

  /**
   * Le chip possono essere rimosse
   */
  public removable = true;

  /**
   * Elenco delle opzioni disponibili per l'autocomplete
   * Caricato da server o ottenuto da modello JSON
   */
  options: any[] = [];

  /**
   * Elenco delle opzioni filtrate per l'autocomplete
   */
  filteredOptions: Observable<any[]>;

  /**
   * Array di appoggio per filtrare le opzioni senza modificare options
   */
  array: any[] = [];

  /**
   * Text field for Autocomplete
   */
  autocompleteTextControl: FormControl;

  /**
   * Un form fittizio per il campo autocomplete
   */
  autocompleteTextForm: NgForm;

  /**
   * Sottoscrizione al servizio dati per l'autocomplete
   */
  subscription: Subscription;

  /**
   * Elenco dei valori selezionati
   */
  public chips: AutocompleteOption[] = [];

  /**
   * Hidden field for real value
   */
  public hiddenControl: FormControl;

  /**
   * Decidiamo se salvare i valori come oggetti o come stringhe
   * Nel caso di stringa possiamo decidere quale proprietà dell'oggetto utilizzare
   */
  valueType: 'object' | 'string' = 'string';
  saveProperty = 'label';

  @ViewChild(MatChipList) private matChipList;

  /**
   * Conserviamo il precedente valore booleano di visibilità
   * per conoscere il momento in cui cambia
   */
  private componentWasVisible: boolean;

  /**
   * L'etichetta da rappresentare
   */
  public displayLabel: string;

  constructor(
    public dataService: DataService,
    private translatable: TranslatablePipe,
    private changeDetector: ChangeDetectorRef,
    private resetOnChangeService: ResetOnChangeService,
    private mapToService: MapToService,
    private utility: UtilityService,
    private elementRef: ElementRef,
    private valueService: ValueService
  ) {
  }

  ngOnInit() {
    if (!this.field) {
      return;
    }
    /**
     * Creo un form fittizio, mi serve per intercettare le modifiche
     */
    this.autocompleteTextForm = new NgForm(null, null);

    /**
     * Se il suffix non è impostato poi ci troviamo "undefined"
     */
    this.field.suffix = this.field.suffix || '';

    /**
     * Calcolo l'etichetta da rappresentare in base ai valori di label e hideLabel
     */
    if (!!this.field.hideLabel) {
      this.displayLabel = '';
    } else {
      this.displayLabel = this.translatable.transform(this.field.label);
    }

    /**
     * Recupero le proprietà valueType e saveProperty dall'oggetto field se presenti
     */
    this.valueType = this.field.data.valueType || this.valueType;
    this.saveProperty = this.field.data.saveProperty || this.saveProperty;
    if (!!this.field.data && !!this.field.data.configurableParams) {
      const configurableParams = this.field.data.configurableParams;
      Object.keys(configurableParams).forEach(v => {
        if (configurableParams[v] !== '') {
          this.resetOnChangeService.registerRule(configurableParams[v], this.field.key);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    /**
     * Recupero un riferimento all'AbstractControl della casella di testo per l'autocomplete
     */
    this.autocompleteTextControl = this.autocompleteTextForm.controls
      .autocompleteText as FormControl;

    /**
     * Imposta le regole per l'autocomplete
     */
    this.manageComboElements();

    /**
     * Recupero un riferimento all'AbstractControl dell'input hidden
     */
    this.hiddenControl = this.formRef.controls[
    this.field.key + this.field.suffix
      ] as FormControl;

    /**
     * Imposto il valore iniziale a null (altrimenti sarebbe stringa vuota)
     */
    setTimeout(() => {
      this.hiddenControl.setValue(null);
    }, 0);
    /**
     * Registra un listener per il campo hidden
     */
    this.registerHiddenFieldListener();
  }

  ngOnDestroy(): void {
    this.chips = [];
  }

  /**
   * Se l'elemento è nascosto deve perdere il valore
   */
  ngAfterContentChecked() {
    /// Se il componente è appena comparso ricarica il valore dal form
    const componentIsVisible = this.valueService.isVisible(this.field);
    if (componentIsVisible && !this.componentWasVisible && !!this.hiddenControl) {
      this.setVisibleValue(this.hiddenControl.value);
    }
    this.componentWasVisible = !!componentIsVisible;
    /// Se il componente è appena scomparso controllo se nel form ce ne sono altri con lo stesso nome
    const componentCount = this.valueService.visibleCount;
    if (!componentCount[this.field.key + this.field.suffix]) {
      /// Non ci sono altri controlli con lo stesso nome
      if (!!this.hiddenControl) {
        this.hiddenControl.reset(null, {onlySelf: true, emitEvent: false});
      }
      this.chips = [];
    }
  }

  /**
   * Funzione che filtra le opzioni per l'autocomplete
   *
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
   * Inizializza tutti i parametri dell'autocomplete
   */
  public manageComboElements() {
    if (!this.field) {
      return;
    }
    switch (this.field.dataSrc) {
      case 'url':
        this.manageUrlComboElements();
        break;
      case 'resource':
        // @todo al momento non lo supportiamo
        this.manageResourceComboElements();
        break;
      case 'values':
        this.manageValuesComboElements();
        break;
      default:
        this.options = this.field.data.values;
        console.warn(`[CHIPS] ${this.field.key}: Unmanaged case ${this.field.dataSrc}`);
    }
  }

  private manageValuesComboElements() {
    this.options = this.field.data.values;
    this.filteredOptions = of(this.options);
    this.changeDetector.detectChanges();
  }

  private manageResourceComboElements() {
    console.warn(this.field.key + ' dataSrc:"resource"  currently unsupported!');
  }

  private manageUrlComboElements() {
    if (this.field.data.autocompleteType !== 'server') {
      const params = this.field.data.params || {};
      if (!this.subscription) {
        this.subscription = this.dataService
          .getResourceByMethod(this.field.data.url || '', this.field.data.method, params) /// Stringa vuota se mancante
          .subscribe((data: IFormOptions[]) => {
            this.manageGetResourceResponse(data);
            this.filteredOptions = this.autocompleteTextControl.valueChanges.pipe(
              map(value => {
                return this._filter(value);
              })
            );
          });
      }
    } else {
      this.filteredOptions =
        this.filteredOptions ||
        this.autocompleteTextControl.valueChanges.pipe(
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
                Object.keys(params).forEach(v => params[v] = value);
                this.dataService.mergeParams(params, configurableParams, this.formRef);
              }
              this.dataService
                .getResourceByMethod(url, this.field.data.method, params)
                .subscribe((data: IFormOptions[]) => {
                  this.manageGetResourceResponse(data);
                });
              return this.array;
            }
          })
        );
    }
  }

  private manageGetResourceResponse(data: IFormOptions[]) {
    this.options = data;
    let label;
    let labelStringField: string;
    if (Array.isArray(this.options) && this.options.length) {
      this.options.forEach(option => {
        label = '';
        labelStringField = undefined;
        /**
         * this.field.data.labelField è un array nel caso in cui io abbia scelto di
         * concatenare piì campi dell'oggetto come label. I campi vengono concatenati con un "-"
         */
        if (Array.isArray(this.field.data.labelField)) {
          this.field.data.labelField.forEach(labelField => {
            if (!!labelStringField) {
              labelStringField = labelStringField + ' - ' + this.translatable.transform(option[labelField]);
            } else {
              labelStringField = this.translatable.transform(option[labelField]);
            }
          });
          label = labelStringField;
        } else {
          label = this.translatable.transform(
            option[this.field.data.labelField || 'descrizione']
          );
        }

        this.array.push({
          label,
          value: option[this.field.data.codiceField || 'codice']
        });
      });
    }
  }

  onBlur($event) {
    if ($event.target.value.length > 2) {
      this.onEnter();
    }
  }

  onEnter() {
    this.options = this.options || [];
    if (this.options.length === 0) {
      const chip: AutocompleteOption = {
        label: this.textInput.nativeElement.value,
        value: this.textInput.nativeElement.value
      };
      this.addChip(chip);
      this.autocompleteTextControl.reset(null, {
        onlySelf: true,
        emitEvent: true
      });
    }
  }

  /**
   * Callback che viene invocata ogni volta che si seleziona un valore dall'Autocomplete
   */
  optionSelected(event: MatAutocompleteSelectedEvent) {
    if (!this.field) {
      return;
    }
    this.addChip(event.option.value);
    this.autocompleteTextControl.reset(null, {
      onlySelf: true,
      emitEvent: true
    });
    this.optionSelectedEvent(event.option.value);
  }

  /**
   * Aggiunge un chip all'elenco
   */
  addChip(chip: AutocompleteOption) {
    this.chips.push(chip);
    // this.hiddenControl.setValue(this.chips);
    this.refreshFieldValue();
  }

  /**
   * Rimuove un chip dall'elenco
   */
  removeChip(chip: AutocompleteOption) {
    this.chips.splice(this.chips.indexOf(chip), 1);
    this.hiddenControl.setValue(this.chips);
    this.refreshFieldValue();
  }

  refreshFieldValue() {
    let value: any = '';
    switch (this.valueType) {
      case 'object':
        value = this.chips && this.chips.length > 0 ? this.chips : null;
        break;
      case 'string':
        value = [];
        for (const chip of this.chips) {
          if (typeof chip === 'string') {
            value.push({label: chip, value: chip});
          } else if (chip.hasOwnProperty(this.saveProperty)) {
            value.push(chip[this.saveProperty].toString());
          } else {
            value.push(JSON.stringify(chip));
          }
        }
        break;
    }
    const sameValue = this.utility.areObjectsEquivalent(value, this.hiddenControl.value);
    this.hiddenControl.setValue(value, {emitEvent: sameValue});
    this.change.emit(value);
    this.changeGlobal.emit(value);
    setTimeout(() => {
      this.hiddenControl.markAsTouched();
      this.formRef.form.markAsDirty();
      this.formRef.form.controls[this.field.key + this.field.suffix].updateValueAndValidity({onlySelf: true});
    }, 0);
  }

  registerHiddenFieldListener() {
    this.hiddenControl.valueChanges.subscribe((v: any[] = []) => {
      this.setVisibleValue(v);
    });
  }

  /**
   * Funzionalita che permette di settare i valori definiti nelle key dell'oggetto mapFieldToFormKey
   * come valore degli idSemantici
   * @param data è l'oggetto selezionato
   */
  public optionSelectedEvent(data: any) {
    this.mapToService.optionSelectedEvent(this.field, data.value, this.formRef, this.options);
  }

  public setVisibleValue(v: any[] = []) {
    if (!Array.isArray(v)) {
      /**
       * Possiamo accettare solo Array come valore,
       * nel caso in cui arrivi qualcosa di diverso
       * verrà utilizzato un array vuoto.
       */
      this.hiddenControl.setValue([]);
      return;
    }
    const value = [];
    if (v.length > 0) {
      for (const chip of v) {
        if (typeof chip === 'string') {
          value.push({label: chip, value: chip});
        } else {
          value.push(chip);
        }
      }
    }
    this.chips = value;
  }
}

export interface AutocompleteOption {
  label: string;
  value: string;
}
