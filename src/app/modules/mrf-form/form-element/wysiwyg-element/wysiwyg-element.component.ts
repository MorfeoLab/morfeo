import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IFormElement, IFormOptions} from '../../shared/models/form-element.model';
import {FormControl, NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AVAILABLE_LANGUAGES} from '../../shared/models/languages.model';
import {UtilityService} from '../../shared/services/utility/utility.service';

/**
 * @method normalizePaste
 * @description Catch paste event on div contenteditable and normalize text data
 * @param e Event
 */
function normalizePaste(e) {
  let clipboardData;
  let pastedData;
  // Stop data actually being pasted into div
  e.stopPropagation();
  e.preventDefault();
  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || (window as any).clipboardData;
  pastedData = clipboardData.getData('text/plain');
  // Paste content as plain text
  document.execCommand('insertText', false, pastedData);
}

@Component({
  selector: 'mrf-wysiwyg-element',
  templateUrl: './wysiwyg-element.component.html',
  styleUrls: ['./wysiwyg-element.component.scss']
})
export class WysiwygElementComponent implements OnInit, AfterViewInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Output() outputEvent = new EventEmitter();
  @Input() readOnly: boolean;

  @ViewChild('richTextArea') private richTextArea: ElementRef;

  // Support form to cath changes
  valuesForm: NgForm;
  // valueText: FormControl;
  languagesCombo: IFormOptions[];
  defaultComboValue: string;

  // Select field
  valueSelect: FormControl;
  valueSelectSubscription: Subscription;

  // Hidden field for real value
  hiddenControl: FormControl;
  hiddenControlVal: any = {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private utility: UtilityService
  ) {
  }

  ngOnInit() {
    if (!this.field) {
      return;
    }
    if (this.utility.isNullOrUndefined(this.formRef)) {
      this.formRef = new NgForm(null, null);
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
  }

  ngAfterViewInit() {
    // Recupero un riferimento all'AbstractControl della casella di testo per l'autocomplete
    // this.valueText =
    //   this.valueText || (this.valuesForm.controls.valueText as FormControl);

    // Recupero un riferimento all'AbstractControl della casella di testo per l'autocomplete
    this.valueSelect =
      this.valueSelect || (this.valuesForm.controls.valueSelect as FormControl);

    // Recupero un riferimento all'AbstractControl dell'input hidden
    if (this.utility.isNullOrUndefined(this.hiddenControl)) {
      if (!this.utility.isNullOrUndefined(this.formRef)) {
        this.hiddenControl = (this.formRef.controls[
        this.field.key + this.field.suffix
          ] as FormControl);
      }
    }

    // Registra un listenere per le modifiche ai campi visibili
    this.registerVisibleFieldsListener();

    // Registra un listener per il campo hidden
    this.registerHiddenFieldListener();

    /// Se arriva un valore iniziale bisogna impostarlo
    if (!this.utility.isNullOrUndefined(this.field.content)) {
      this.hiddenControl.setValue(this.field.content);
      this.changeDetectorRef.detectChanges();
    }

    this.setContentEditable();
  }

  /**
   * @method setContentEditable
   * @description Add listener to paste event on div and set default separator
   */
  setContentEditable() {
    this.richTextArea.nativeElement
      .addEventListener('paste', normalizePaste);
    document.execCommand('DefaultParagraphSeparator', false, 'span');
  }

  /**
   * @method contentChanged
   * @description Emit event to parent to communicate changes
   */
  contentChanged() {
    const selectedLanguage = this.valueSelect.value;
    // const contentText = this.richTextArea.nativeElement.innerHTML;
    // this.hiddenControlVal[selectedLanguage] = contentText;
    this.hiddenControlVal[selectedLanguage] = this.richTextArea.nativeElement.innerHTML;
    this.outputEvent.emit(this.hiddenControlVal);
  }

  keyChanged() {
    const selectedLanguage = this.valueSelect.value;
    const contentText = this.richTextArea.nativeElement.innerHTML;
    if (contentText !== this.hiddenControlVal[selectedLanguage]) {
      this.richTextArea.nativeElement.innerHTML = this.hiddenControlVal[selectedLanguage] || '';
    }
  }

  /**
   * @method editText
   * @description Centralize text action's to modify text style
   */
  editText(command: string) {
    let options = null;
    switch (command) {
      case 'createLink':
        options = prompt('Enter a URL:', 'http://');
        document.execCommand(command, false, options);
        break;
      default:
        document.execCommand(command, false, options);
    }
  }

  /**
   * @method registerHiddenFieldListener
   * @description Catch valueChange on hiddenControl form to set the selected value
   */
  registerHiddenFieldListener() {
    this.hiddenControl.valueChanges.subscribe(v => {
      if (this.utility.isNullOrUndefined(v)) {
        v = {};
        for (const option of this.languagesCombo) {
          v[option.value] = v[option.value] || '';
        }
        this.hiddenControl.setValue(v, {onlySelf: true, emitEvent: false});
        return;
      }
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
        this.richTextArea.nativeElement.innerHTML = newTextValue;
      });
  }
}
