import {Component, Input} from '@angular/core';
import {IFormElement} from '../../shared/models/form-element.model';

@Component({
  selector: 'mrf-html-element',
  templateUrl: './html-element.component.html',
  styleUrls: ['./html-element.component.scss']
})
export class HtmlElementComponent {
  @Input() field: IFormElement;
  @Input() readOnly: boolean;

  decodeURI(s: string) {
    if(!s) {
      return '';
    }
    this.field.tag = this.field.tag || 'p';
    s = s.replace(/%(?![a-f0-9]{2})/gi, '%25');
    return `<${this.field.tag}>${decodeURI(s)}</${this.field.tag}>`;
  }
}
