import {Injectable, QueryList} from '@angular/core';
import {Subject} from 'rxjs';
import {IForm, IFormElement} from '../../models/form-element.model';
import {UtilityService} from '../utility/utility.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  $eventHandler: Subject<any> = new Subject<any>();

  public tabGroups: MatTabGroup[] = [];
  // public jsonField: { [key: string]: string[] } = {};
  public jsonField: { [key: string]: { tabs: string[], label: string } } = {};

  constructor(
    public utilityService: UtilityService
  ) {
  }

  registerTabGroup(tabs: MatTabGroup) {
    this.tabGroups.push(tabs);
  }

  registerJson(json: IFormElement, tabsNames: string[] = [], parentType: string = '') {

    switch (json.type) {
      case 'autocomplete':
      case 'checkbox':
      case 'chips':
      case 'datetime':
      case 'email':
      case 'file':
      case 'map':
      case 'mapHtml':
      case 'multiLang':
      case 'objectList':
      case 'objectList2':
      case 'number':
      case 'password':
      case 'phoneNumber':
      case 'radio':
      case 'select':
      case 'selectboxes':
      case 'textarea':
      case 'codeEditor':
      case 'textfield':
        /// Salva o aggiorna
        if (Array.isArray(tabsNames) && tabsNames.length > 0) {
          this.jsonField[json.key] = {tabs: [...tabsNames], label: json.label};
        }
        break;
      case 'columns':
        /// Ricorsione di tutti i figli
        for (const column of json.columns) {
          for (const figlio of column.components) {
            this.registerJson(figlio, tabsNames, 'column');
          }
        }
        break;
      case 'container':
      case 'fieldset':
      case 'repeatable':
      case 'tabs':
        /// Ricorsione di tutti i figli
        for (const figlio of json.components) {
          this.registerJson(figlio, tabsNames, json.type);
        }
        break;
      case 'panel':
      case 'button':
      case 'htmlelement':
      default:
        if (parentType === 'tabs') {
          /// Aggiungi il mio nome a tabNames
          tabsNames = tabsNames.concat([json.label]);
          for (const figlio of json.components) {
            this.registerJson(figlio, tabsNames, json.type);
          }
          break;
        }
        if (parentType === 'columns') {
          /// Si tratta comunque di un contenitore
          for (const figlio of json.components) {
            this.registerJson(figlio, tabsNames, json.type);
          }
        }
    }
  }

  getTabPath(search: string) {
    return this.jsonField[search];
  }

  public getAllTabs() {
    return this.jsonField;
  }

  activateTabs(label: string) {
    label = label.trim().toLowerCase();
    for (const tabGroup of this.tabGroups) {
      const tabs: QueryList<MatTab> = tabGroup._tabs;
      tabs.forEach((tab, index) => {
        /**
         * @todo: l'etichetta stampata non corrisponde alla key, come era una volta, quindi
         * questo metodo per recuperare il tab non funziona più, anche se alcuni casi
         * sembrano funzionare (es. ANAGRAFICA => Anagrafica) in realtà occorre riscrivere
         * questa funzione.
         */
        if (tab.textLabel.trim().toLowerCase() === label) {
          tabGroup.selectedIndex = index;
          return;
        }
      });
    }
  }

  /**
   * Iterate over components annidations to find next tab to open.
   * IMPORTANT: goes up to 3 level deep!!!
   *
   * TODO: needs some refactor!
   */
  openNextTab(formModel: IForm) {
    window.scrollTo(0, 0);
    formModel.components.forEach((firstLevelComponent: IFormElement) => {
      /// Imposta il valore di Selected Index a zero se undefined
      firstLevelComponent.selectedIndex = +firstLevelComponent.selectedIndex || 0;
      /// Seleziono il tab corrispondente al selectedIndex
      const shownComponent: IFormElement = firstLevelComponent.components[firstLevelComponent.selectedIndex];

      if (!!shownComponent.components.length) {
        /// Se il tab ha figli (deve averne) seleziono il primo
        const secondLevelComponent = shownComponent.components[0];
        if (!!secondLevelComponent.components[secondLevelComponent.selectedIndex]) {
          if (secondLevelComponent.type === 'tabs') {
            /// Se questo componente è tabs imposta il valore di Selected Index a zero se undefined
            secondLevelComponent.selectedIndex = +secondLevelComponent.selectedIndex || 0;
            /// Seleziono il tab corrispondente al selectedIndex
            const secondLevelShownComponent: IFormElement = secondLevelComponent.components[secondLevelComponent.selectedIndex];
            if (secondLevelShownComponent.components.length) {
              /// Se il tab ha figli (deve averne) seleziono il primo
              const thirdLevelComponent = secondLevelShownComponent.components[0];

              if (thirdLevelComponent.type === 'tabs') {
                /// Se questo compoennte è tabs imposta il valore di Selected Index a zero se undefined
                thirdLevelComponent.selectedIndex = +thirdLevelComponent.selectedIndex || 0;

                if (thirdLevelComponent.selectedIndex < thirdLevelComponent.components.length - 1) {
                  /// Se il terzo livello non si trova già all'ultimo disponibile va avanti il terzo livello
                  thirdLevelComponent.selectedIndex = thirdLevelComponent.selectedIndex + 1;
                } else if (secondLevelComponent.selectedIndex < secondLevelComponent.components.length - 1) {
                  /// Se il secondo livello non si trova già all'ultimo disponibile va avanti il secondo livello
                  secondLevelComponent.selectedIndex = secondLevelComponent.selectedIndex + 1;
                } else if (firstLevelComponent.selectedIndex < firstLevelComponent.components.length - 1) {
                  /// Se il primo livello non si trova già all'ultimo disponibile va avanti il primo livello
                  firstLevelComponent.selectedIndex = firstLevelComponent.selectedIndex + 1;
                }

              } else if (secondLevelComponent.selectedIndex < secondLevelComponent.components.length - 1) {
                secondLevelComponent.selectedIndex = secondLevelComponent.selectedIndex + 1;
              } else if (firstLevelComponent.selectedIndex < firstLevelComponent.components.length - 1) {
                firstLevelComponent.selectedIndex = firstLevelComponent.selectedIndex + 1;
              }
            }
          }
        } else if (firstLevelComponent.selectedIndex < firstLevelComponent.components.length - 1) {
          firstLevelComponent.selectedIndex = firstLevelComponent.selectedIndex + 1;
        }
      }
    });
  }
}
