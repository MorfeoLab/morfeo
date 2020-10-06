import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {ValueService} from '../../shared/services/value/value.service';
import {Moment} from 'moment';
import {DatepickerService} from '../../shared/services/datepicker-service/datepicker.service';


@Component({
  selector: 'mrf-date-element',
  templateUrl: './date-element.component.html',
  styleUrls: ['./date-element.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class DateElementComponent implements OnInit, AfterContentChecked {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;

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
    private translatable: TranslatablePipe,
    private valueService: ValueService,
    private datepickerService: DatepickerService
  ) {
  }

  ngOnInit() {
    if (!this.field) {
      return;
    }
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

  myFilter = (d: Moment | Date): boolean => {
    if (!d) {
      return true;
    }
    const myFilter = this.datepickerService.getFilter(this.field.filter);
    if (!myFilter) {
      return true;
    }
    if (d.hasOwnProperty('getDay')) {
      /// d is Date already
      return myFilter(d as Date);
    }
    return myFilter((d as Moment).toDate());
  }
}
