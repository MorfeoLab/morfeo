import {IFormElement} from '../../shared/models/form-element.model';
import {NgForm} from '@angular/forms';

export interface DataSelectData {
    field: IFormElement;
    externalData: { [key: string]: any };
    selected: any[];
    formRef: NgForm;
}
