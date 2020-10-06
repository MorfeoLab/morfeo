import {AfterContentChecked, Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {MatRadioGroup} from '@angular/material/radio';
import {ValueService} from "../../shared/services/value/value.service";

@Component({
  selector: 'mrf-radio-element',
  templateUrl: './radio-element.component.html',
  styleUrls: ['./radio-element.component.scss']
})
export class RadioElementComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatRadioGroup) matRadioGroup;
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;

  /**
   * L'etichetta da rappresentare
   */
  public displayLabel: string;

  public labelIsBlank = false;

  /**
   * Conserviamo il precedente valore booleano di visibilità
   * per conoscere il momento in cui cambia
   */
  private componentWasVisible: boolean;

  constructor(
    private translatable: TranslatablePipe,
    private valueService: ValueService
  ) {
  }

  ngOnInit(): void {
    this.field.suffix = this.field.suffix || '';

    /**
     * Calcolo l'etichetta da rappresentare in base ai valori di label e hideLabel
     */
    if (!!this.field.label && this.field.label.trim().length === 0) {
      this.labelIsBlank = true;
    }
    if (!!this.field.hideLabel) {
      this.displayLabel = '';
    } else {
      this.displayLabel = this.field.label;
    }
  }

  hasRequiredError(model: any) {
    if(model.dirty || model.touched) {
      return model.hasError('required');
    } else {
      return false;
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

  setTouched(hiddenElement: NgModel) {
    hiddenElement.control.markAsTouched();
  }
}
