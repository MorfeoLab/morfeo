import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlyBoolean'
})
export class OnlyBooleanPipe implements PipeTransform {

  transform(value: any, args?: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    return false;
  }

}
