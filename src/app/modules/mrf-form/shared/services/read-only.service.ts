import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Classe esportata
 */
export class ReadOnlyService {

  constructor() {
  }

  setTypeReadOnly(data) {
    /// Se type non è uno dei contenitori
    if (![
      'columns',
      'container',
      'fieldset',
      'table',
      'tabs',
      'htmlelement',
      'well'
    ].includes(data.type)) {
      /// Se type è un input
      if ([
        'textarea',
        'textfield',
        'image',
        'codeEditor',
        'select',
        'autocomplete',
        'chips',
        'map',
        'mapArea',
        'button',
        'datetime',
        'file',
        'repeatable',
        'objectList',
        'objectList2',
        'mapHtml',
        'radio'
      ].includes(data.type)) {
        data.displayMode = 'output';
      }
      /*
      * Disabilito checkbox, radio e select, non ho bisogno di impostare la proprietà displayMode
      * */
      if (data.type === 'checkbox' || data.type === 'selectboxes') {
        data.disabled = true;
      }
    }

    if (!!data[data.type]) {
      this.checkForLayout(data[data.type]);
    } else if (!!data.components) {
      this.checkForLayout(data.components);
    }
    return data;
  }

  checkForLayout(structure) {
    for (const component of structure) {
      this.setTypeReadOnly(component);
    }
  }
}
