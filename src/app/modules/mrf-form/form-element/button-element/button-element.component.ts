import {Component, Input} from '@angular/core';
import {ButtonService} from '../../shared/services/button/button.service';
import {NgForm} from '@angular/forms';
import {IFormButton, IFormElement} from '../../shared/models/form-element.model';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';

@Component({
    selector: 'mrf-button-element',
    templateUrl: './button-element.component.html',
    styleUrls: ['./button-element.component.scss']
})
export class ButtonElementComponent {
    public buttonField: IFormButton;
    // tslint:disable-next-line:variable-name
    private _field: IFormElement;
    get field(): IFormElement {
        return this._field;
    }

    @Input() set field(fld: IFormElement) {
        this._field = fld;
        this._field.suffix = this._field.suffix || '';
        this.buttonField = {...fld, ...fld.buttonData} as IFormButton;
    }

    @Input() formRef: NgForm;
    @Input() readOnly: boolean;

    public isLoading = false;

    constructor(
        public buttonService: ButtonService,
        private translatable: TranslatablePipe
    ) {
    }

    execute() {
        this.buttonService.commonFunction(this.buttonField.action, this.field, this.formRef, this);
    }

    public displayLabel(): string {
        if (!!this.field.hideLabel) {
            /// Non ha senso un pulsante senza testo, non sarebbe cliccabile
            return '#';
        } else {
            return this.translatable.transform(this.field.label);
        }
    }
}
