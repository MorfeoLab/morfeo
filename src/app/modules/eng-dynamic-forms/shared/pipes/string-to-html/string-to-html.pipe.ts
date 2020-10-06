import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToHtml'
})
export class StringToHtmlPipe implements PipeTransform {
  transform(value: string): any {
    if(!value) {
      return '';
    }
    return value
      .split('&lt;')
      .join('<')
      .split('&gt;')
      .join('>');
  }
}
