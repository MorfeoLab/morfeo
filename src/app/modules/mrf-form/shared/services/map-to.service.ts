import { Injectable } from '@angular/core';
import {IForm, IFormElement} from '../models/form-element.model';
import {FormControl, NgForm} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MapToService {

  constructor() { }

  /**
   * Funzionalita che permette di settare i valori definiti nelle key dell'oggetto mapFieldToFormKey
   * come valore degli idSemantici
   * @param data è l'oggetto selezionato
   */
  public optionSelectedEvent(field: IFormElement, selectedValue: any, formRef: NgForm, options: any[]) {
    if (!field.data) {
      return;
    }
    const mapFieldToFormKey = field.data.mapFieldToFormKey;
    if (!mapFieldToFormKey) {
      return;
    }
    for (const key in mapFieldToFormKey) {
      if (mapFieldToFormKey.hasOwnProperty(key)) {
        const idSemantico = mapFieldToFormKey[key];
        if (!!idSemantico) {
          for (const o of options) {
            if (o[field.valueProperty] === selectedValue) {
              if (!!formRef.controls[idSemantico]) {
                formRef.controls[idSemantico].reset(o[key]);
              } else {
                console.error('Non esiste il formRef.controls per ' + idSemantico);
              }
            }
          }
        }
      }
    }
  }
}
