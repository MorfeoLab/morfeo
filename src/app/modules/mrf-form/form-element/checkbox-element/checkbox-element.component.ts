import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {MatCheckbox} from '@angular/material/checkbox';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'mrf-checkbox-element',
    templateUrl: './checkbox-element.component.html',
    styleUrls: ['./checkbox-element.component.scss']
})
export class CheckboxElementComponent implements OnInit {
    @Input() field: IFormElement;
    @Input() formRef: NgForm;
    @Input() readOnly: boolean;

    public displayLabel: string;

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

    ngOnInit() {
        if (!!this.field) {
            this.field.suffix = this.field.suffix || '';

            if (!!this.field.hideLabel) {
                this.displayLabel = '';
            } else {
                this.displayLabel = this.translatable.transform(this.field.label);
            }
        }
    }

    hasRequiredError(model: any) {
        if (model.dirty || model.touched) {
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
}
