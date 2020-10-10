import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {
  IFormElement,
  IFormOptions
} from '../../shared/models/form-element.model';
import { NgForm, FormControl } from '@angular/forms';
import { AVAILABLE_LANGUAGES } from '../../shared/models/languages.model';
import { Subscription } from 'rxjs';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';

@Component({
  selector: 'mrf-text-multilingua',
  templateUrl: './text-multilingua.component.html',
  styleUrls: ['./text-multilingua.component.scss']
})
export class TextMultilinguaComponent implements OnInit, AfterViewInit {
  // JSON Model
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;

  // Support form to cath changes
  valuesForm: NgForm;
  valueText: FormControl;
  valueTextSubscription: Subscription;
  languagesCombo: IFormOptions[];
  defaultComboValue: string;

  // Select field
  valueSelect: FormControl;
  valueSelectSubscription: Subscription;

  // Hidden field for real value
  hiddenControl: FormControl;
  hiddenControlVal: any = {};

  /**
   * L'etichetta da rappresentare
   */
  public displayLabel: string;

  constructor(
    private translatable: TranslatablePipe
  ) {}

  ngOnInit() {
    if (!this.field) {
      return;
    }
    this.valuesForm = new NgForm(null, null);
    /**
     * Setto la lingua italiana come valore iniziale
     */
    this.languagesCombo = this.field.values || AVAILABLE_LANGUAGES;
    this.defaultComboValue = this.languagesCombo[0].value;
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
  }

  ngAfterViewInit(): void {
    // Recupero un riferimento all'AbstractControl della casella di testo per l'autocomplete
    this.valueText =
      this.valueText || (this.valuesForm.controls.valueText as FormControl);

    // Recupero un riferimento all'AbstractControl della casella di testo per l'autocomplete
    this.valueSelect =
      this.valueSelect || (this.valuesForm.controls.valueSelect as FormControl);

    // Recupero un riferimento all'AbstractControl dell'input hidden
    this.hiddenControl =
      this.hiddenControl ||
      (this.formRef.controls[
        this.field.key + this.field.suffix
      ] as FormControl);

    // Registra un listenere per le modifiche ai campi visibili
    this.registerVisibleFieldsListener();

    // Registra un listener per il campo hidden
    this.registerHiddenFieldListener();
  }

  /**
   * @method registerHiddenFieldListener
   * @description Catch valueChange on hiddenControl form to set the selected value
   */
  registerHiddenFieldListener() {
    this.hiddenControl.valueChanges.subscribe(v => {
      for (const lang in v) {
        if (v.hasOwnProperty(lang)) {
          this.valueSelect.setValue(lang);
          return;
        }
      }
    });
  }

  /**
   * @method registerVisibleFieldsListener
   * @description FIXME - Add description
   */
  registerVisibleFieldsListener() {
    this.valueSelectSubscription =
      this.valueSelectSubscription ||
      this.valueSelect.valueChanges.subscribe(value => {
        let newTextValue = '';
        if (this.hiddenControlVal.hasOwnProperty(value)) {
          newTextValue = this.hiddenControlVal[value];
        }
        this.valueText.setValue(newTextValue);
      });
    this.valueTextSubscription =
      this.valueTextSubscription ||
      this.valueText.valueChanges.subscribe((value: string) => {
        const selectedLanguage = this.valueSelect.value;
        if (this.hiddenControlVal === '') {
          this.hiddenControlVal = {};
        }
        this.hiddenControlVal[selectedLanguage] = value;
      });
  }
}
