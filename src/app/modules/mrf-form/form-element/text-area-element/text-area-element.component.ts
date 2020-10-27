import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { IFormElement } from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
  selector: 'mrf-text-area-element',
  templateUrl: './text-area-element.component.html',
  styleUrls: ['./text-area-element.component.scss']
})
export class TextAreaElementComponent implements OnInit, AfterContentChecked {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;

  /**
   * L'etichetta da rappresentare
   */
  public displayLabel: string;

  /**
   * Conserviamo il precedente valore booleano di visibilità
   * per conoscere il momento in cui cambia
   */
  private componentWasVisible: boolean;

  constructor(
    private translatable: TranslatablePipe,
    private valueService: ValueService
  ) {}

  ngOnInit(): void {
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
