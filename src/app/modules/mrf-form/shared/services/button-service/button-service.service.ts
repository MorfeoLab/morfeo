import {Injectable} from '@angular/core';
import {IFormElement} from '../../models/form-element.model';
import {NgForm} from '@angular/forms';
import {UtilityService} from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {
  private callbackList: { [key: string]: () => void } = {};

  constructor(
    private utility: UtilityService
  ) {
  }

  public registerCallback(buttonName: string, callback: () => void): void {
    if(this.utility.isNullOrUndefined(this.callbackList)){
      this.callbackList = {};
    }
    this.callbackList[buttonName] = callback;
  }

  public commonFunction(functionName: string, buttonElement: IFormElement, form: NgForm) {
    if (functionName === 'callback'){
      this.callbackList[buttonElement.key + buttonElement.suffix]();
    }
    if (functionName === 'copy') {
      /**
       * In questo momento è supportata solo l'azione "copy"
       */
      const currentValue = form.value;
      const destValue = {};
      const fieldSuffix = buttonElement.suffix || '';
      if (buttonElement.content.hasOwnProperty('copy')) {
        if (
          typeof buttonElement.content.copy === 'string' &&
          this.utility.isJSON(buttonElement.content.copy)
        ) {
          buttonElement.content.copy = JSON.parse(buttonElement.content.copy);
        }
        if (Array.isArray(buttonElement.content.copy)) {
          for (const copyField of (buttonElement.content.copy)) {
            destValue[copyField.to + fieldSuffix] = currentValue[copyField.from + fieldSuffix];
          }
        }
      }
      form.setValue(destValue);
    }
  }
}
