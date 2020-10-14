import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UtilityService} from '../../services/utility/utility.service';

@Pipe({
  name: 'translatable',
})
export class TranslatablePipe implements PipeTransform {
  constructor(
    private ts: TranslateService,
    private utility: UtilityService) {
  }

  // gli oggetti traducibili della bmd sono mappe<lingua, label>
  // bisogna gestire questa traducibilita' in modo da far comparire sempre
  // almeno la prima anche in caso di lingua che non matcha con quella impostata sul browser
  transform(value: any, args?: any): any {
    if (this.utility.isNullOrUndefined(value)) {
      return '';
    }

    if (typeof value === 'string') {
      // se il valore è una stringa, ritorna il valore stesso
      return value;
    } else if (typeof value === 'number') {
      /// se il valore è un numero, ritorna una stringa contenente il numero
      return String(value);
    }

    const defaultLang = this.ts.getDefaultLang();
    let currentLang = this.ts.getBrowserLang();

    // @TODO spesso non si accorge che la lingua cambia.
    if (typeof args === 'string' && args.length === 2) {
      currentLang = args;
    }

    // cerca la lingua corrente
    if (!Array.isArray(value)) {
      if (value[currentLang]) {
        return value[currentLang];
      }
      // se non la trova cerca la lingua di default
      if (value[defaultLang]) {
        return value[defaultLang];
      }
      // se non trova nemmeno quella prende il primo valore
      // tslint:disable-next-line: forin
      for (const key in value) {
        return value[key];
      }
    } else if (value.length > 0) {
      let defaultValue: string;
      let currentValue: string;
      for (const v of value) {
        if (v.lang === defaultLang) {
          defaultValue = v.descrizione;
        }
        if (v.lang === currentLang) {
          currentValue = v.descrizione;
        }
      }
      return currentValue || defaultValue || value;
    }
    return null;
  }
}
