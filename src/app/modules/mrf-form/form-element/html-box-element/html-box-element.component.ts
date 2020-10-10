import {Component, Input} from '@angular/core';
import {IFormElement} from '../../shared/models/form-element.model';

@Component({
  selector: 'mrf-html-box-element',
  templateUrl: './html-box-element.component.html',
  styleUrls: ['./html-box-element.component.scss']
})
export class HtmlBoxElementComponent {
  @Input() field: IFormElement;
  @Input() readOnly: boolean;
}
