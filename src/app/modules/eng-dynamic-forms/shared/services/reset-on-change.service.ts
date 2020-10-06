import {EventEmitter, Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';

/**
 * Questo servizio serve per registrare degli eventListner il cui scopo è quello di resettare il valore di un campo
 * al valueChanges di un altro campo. è stato introdotto per la gestione degli automcomplete le cui chiamate url
 * sono parametrizzate per altri valori presenti nel form.
 * Ad esempio la chiamata al servizio che recupera i comuni deve essere parametrizzabile per un campo provincia
 * e/o data di nascita.
 * Ovviamente se cambia il valore di uno di questi campi (es. la provincia) il valore del campo che da essi dipende
 * (il comune) deve essere azzerato, in caso contrario avremo una incoerenza tra provincia e comune.
 */
@Injectable({
  providedIn: 'root'
})
export class ResetOnChangeService {

  private rulesArray: any[] = [];

  constructor() { }

  public resetFieldEvent = new EventEmitter();

  /**
   * Quando il form è pronto si registra al service cosi vengono inizializzati i listner
   */
  registerForm(f: NgForm) {
      for (const rule of this.rulesArray) {
        Object.keys(rule).forEach(v => {
          if (!!f.controls[v]) {
            f.controls[v].valueChanges.subscribe(() => {
              if (!!f.controls[rule[v]]) {
                f.controls[rule[v]].setValue('');
                this.resetFieldEvent.emit({key: rule[v]});
              }
            });
          } else {
            console.error('ERROR in ' + v);
          }
        });
      }
  }

  /**
   * Quando un componente vuole essere azzerato in funzione del change di un altro campo di input si registra qui.
   */
  registerRule(
    keyToListen: string,
    ketToReset: string
  ) {
    if (!!keyToListen && !!ketToReset && keyToListen !== '$') {
      const item = {};
      item[keyToListen] = ketToReset;
      this.rulesArray.push(item);
    }
  }

}
