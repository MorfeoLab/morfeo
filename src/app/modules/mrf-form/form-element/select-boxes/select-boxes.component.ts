import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {DataService} from '../../shared/services/data-service/data-service.service';
import {ComboService} from '../../shared/services/combo-service/combo.service';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {MatCheckbox} from '@angular/material/checkbox';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
  selector: 'mrf-select-boxes',
  templateUrl: './select-boxes.component.html',
  styleUrls: ['./select-boxes.component.scss']
})
export class SelectBoxesComponent implements OnInit, AfterViewInit, AfterContentChecked {
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
   * Hidden field for real value
   */
  public hiddenControl: FormControl;

  /**
   * Elenco di tutte le checkbox
   */
  @ViewChildren(MatCheckbox) private checkBoxes: QueryList<MatCheckbox>;

  public labelIsBlank = false;

  /**
   * Elenco di tutte le checkbox per nome
   */
  private checkBoxesMap: { [key: string]: MatCheckbox } = {};

  /**
   * La checkbox in alto
   */
  private masterCheckBox: MatCheckbox;

  /**
   * L'etichetta da rappresentare
   */
  public displayLabel: string;

  /**
   * Conserviamo il precedente valore booleano di visibilità
   * per conoscere il momento in cui cambia
   */
  private componentWasVisible: boolean;

  private valueField = 'codice';
  private labelField = 'descrizione';

  constructor(
    private dataService: DataService,
    private translatable: TranslatablePipe,
    private changeDetector: ChangeDetectorRef,
    private comboService: ComboService,
    private utility: UtilityService,
    private valueService: ValueService
  ) {
  }

  ngOnInit() {
    this.valueField = this.field.valueProperty || this.valueField;
    this.labelField = this.field.labelProperty || this.labelField;
    this.field.valueProperty = this.valueField;
    this.field.labelProperty = this.labelField;
    this.field.suffix = this.field.suffix || '';
    this.field.hideSelectAll = this.field.hideSelectAll || false;

    /**
     * Calcolo l'etichetta da rappresentare in base ai valori di label e hideLabel
     */
    if (!!this.field.label && this.field.label.trim().length === 0) {
      this.labelIsBlank = true;
    }
    if (!!this.field.hideLabel) {
      this.displayLabel = '';
    } else {
      this.displayLabel = this.translatable.transform(this.field.label);
    }

    if (!!this.field.values) {
      this.field.values = this.field.values.map(item => {
        return {
          label: String(item.label).trim(),
          value: this.sanitize(item.value)
        };
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.field.dataSrc === 'url') {
      this.manageUrlSelectboxesElements();
    } else if (this.field.dataSrc === 'resource') {
      this.manageSelectboxesElements();
    } else {
      this.checkBoxes.forEach((cb: any) => {
        if (cb.name !== 'toggle-select-all') {
          this.checkBoxesMap[cb.name] = cb;
        } else {
          this.masterCheckBox = cb;
        }
      });
    }
    /**
     * Se presente un solo checkbox TUTTI viene nascosto
     */
    this.hiddenSelectAll();

    /**
     * Se non ho un form (i.e. mi trovo nel composer) non posso fare altro
     */
    if (!this.formRef) {
      return;
    }
    /**
     * Recupero un riferimento all'AbstractControl dell'input hidden
     */
    this.hiddenControl = this.formRef.controls[
    this.field.key + this.field.suffix
      ] as FormControl;
    /**
     * Registra un listener per il campo hidden
     */
    this.registerHiddenFieldListener();
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
          for (const key in this.checkBoxesMap) {
            if (this.checkBoxesMap[key].checked) {
              this.checkBoxesMap[key].toggle();
            }
          }
        }
      }
    }
    this.componentWasVisible = !!componentIsVisible;
  }


  /**
   * Registra un listener ai cambiamenti del campo hidden
   * Il valore che ci si aspetta è un array di stringhe in formato stringa JSON
   */
  registerHiddenFieldListener() {
    if (!this.hiddenControl) {
      return;
    }
    this.hiddenControl.valueChanges.subscribe((v: string) => {
      let valueList: string[] = [];
      if (this.utility.isJSON(v)) {
        valueList = JSON.parse(v);
      } else if (typeof v === 'string') {
        if (/\t/.test(v)) {
          /// La stringa contiene un tab
          valueList = v.split('\t');
        } else {
          /// Una stringa non splittabile?
          valueList = [v];
        }
      }
      if (Array.isArray(valueList)) {
        valueList = valueList.map(item => {
          return String(item);
        });
      }
      const foundValues: string[] = [];
      for (let key of valueList) {
        key = key.trim();
        if (this.checkBoxesMap.hasOwnProperty(key)) {
          foundValues.push(key);
        }
      }
      if (valueList.length !== foundValues.length) {
        this.hiddenControl.setValue(JSON.stringify(foundValues), {onlySelf: true, emitEvent: false});
        return; // avoid loop
      }
      let checkedCount = 0;
      let uncheckedCount = 0;
      for (const name of Object.keys(this.checkBoxesMap)) {
        const shouldBeChecked: boolean = foundValues.indexOf(name) >= 0;
        const isChecked: boolean = this.checkBoxesMap[name].checked;
        if (shouldBeChecked !== isChecked) {
          this.checkBoxesMap[name].checked = shouldBeChecked;
        }
        if (shouldBeChecked) {
          checkedCount++;
        } else {
          uncheckedCount++;
        }
      }
      if (!!this.masterCheckBox) {
        this.masterCheckBox.checked = uncheckedCount === 0;
      }
    });
  }

  changedCheckbox() {
    const value: string[] = [];
    for (const key in this.checkBoxesMap) {
      if (this.checkBoxesMap.hasOwnProperty(key) && key !== 'toggle-select-all') {
        if (this.checkBoxesMap[key].checked) {
          value.push(key);
        }
      }
    }
    if (!!this.hiddenControl) {
      if (value.length > 0) {
        this.hiddenControl.setValue(JSON.stringify(value));
      } else {
        this.hiddenControl.setValue(null);
      }
      this.hiddenControl.markAsTouched();
    }
    setTimeout(() => {
      this.hiddenControl.markAsTouched();
      this.formRef.form.markAsDirty();
      this.formRef.form.controls[this.field.key + this.field.suffix].updateValueAndValidity({onlySelf: true});
    }, 0);
  }

  toggleSelectAll($event) {
    const value: string[] = [];
    for (const name of Object.keys(this.checkBoxesMap)) {
      if (name !== 'toggle-select-all') {
        if ($event.checked) {
          value.push(name);
        }
        this.checkBoxesMap[name].checked = $event.checked;
      }
    }
    if (!!this.hiddenControl) {
      if (value.length > 0) {
        this.hiddenControl.setValue(JSON.stringify(value));
      } else {
        this.hiddenControl.setValue(null);
      }
      this.hiddenControl.markAsTouched();
    }
  }

  hasRequiredError(model: any) {
    if (model.dirty || model.touched) {
      return model.hasError('required');
    } else {
      return false;
    }
  }

  private manageUrlSelectboxesElements() {
    this.dataService
      .getResource(this.field.data.url)
      .subscribe(
        (data: any[]) => {
          this.field.values = data.map(item => {
            return {
              value: item[this.valueField] || this.sanitize(this.translatable.transform(item[this.labelField])),
              label: this.translatable.transform(item[this.labelField]),
              checked: null
            };
          });
          this.redraw();
          this.comboService.unregisterComboWithRemoteData(this.field.key + this.field.suffix);
        },
        () => {
          this.comboService.unregisterComboWithRemoteData(this.field.key + this.field.suffix);
        }
      );
  }

  private manageSelectboxesElements() {
    this.comboService.collectionChange.subscribe(change => {
      if (change.key === this.field.key + this.field.suffix) {
        this.field.values = change.list;
        this.redraw();
      }
    });
    console.warn(this.field.key + ' dataSrc:"resource"  currently unsupported!');
  }

  private redraw() {
    this.changeDetector.detectChanges();
    setTimeout(() => {
      this.checkBoxesMap = {};
      this.checkBoxes.forEach((cb: any) => {
        if (cb.name !== 'toggle-select-all') {
          this.checkBoxesMap[cb.name] = cb;
        } else {
          this.masterCheckBox = cb;
        }
      });
      // qui ricalcolo il numero di checkbox
      this.hiddenSelectAll();
    });
  }

  private hiddenSelectAll() {
    if (Object.keys(this.checkBoxesMap).length === 1) {
      this.field.hideSelectAll = true;
    }
  }

  private sanitize(str) {
    /**
     * Non possiamo modificare il valore inserito ma per evitare
     * malfunzionamenti siamo obbligati almeno a rimuovere gli spazi
     * duplicati, i tab e gli altri caratteri non stampabili
     */
    return str.replace(/\s+/gim, ' ').trim();
  }
}

