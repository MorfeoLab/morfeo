import {Component, EventEmitter, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm, IFormElement, IFormOptions} from './shared/models/form-element.model';
import {TabsService} from './shared/services/tabs/tabs.service';
import {ConditionalService} from './shared/services/conditional/conditional.service';
import {DataService} from './shared/services/data-service/data-service.service';
import {ComboService} from './shared/services/combo-service/combo.service';
import {Subscription} from 'rxjs';
import {UtilityService} from './shared/services/utility/utility.service';
import {UploaderService} from './shared/services/uploader.service';
import {ResetOnChangeService} from './shared/services/reset-on-change.service';
import {MatSelect} from '@angular/material/select';
import {ValueService} from './shared/services/value/value.service';
import {ExternalDataService} from "./shared/services/external-data.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-eng-dynamic-forms, mrf-form',
  templateUrl: './eng-dynamic-forms.component.html',
  styleUrls: ['./eng-dynamic-forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EngDynamicFormsComponent implements OnDestroy, OnInit {
  /**
   * La definizione JSON del form da costruire
   */
  private formJson;

  /**
   * Un flag booleano che stabilisce se possiamo emettere l'evento
   */
  private shouldEmitReadyEvent = true;

  // noinspection JSMismatchedCollectionQueryUpdate
  /**
   * Un elenco di id di combo che sono in attesa di caricare le loro opzioni
   */
  private comboLoadingList: string[] = [];

  /**
   * Sottoscrizione agli eventi di upload
   */
  private uploadServiceSubscription: Subscription;

  /**
   * Dati esterni da considerare per le regole
   */
  @Input() public externalData: { [key: string]: any } = {};
  /**
   * La configurazione JSON per il form
   */
  @Input() public config: FormContainerConfig = {};

  /**
   * Riferimento al form generato
   */
  @ViewChild('f') public f: NgForm;

  /**
   * Evento scatenato nel momento in cui il form sarà disponibile
   */
  public formReadyEvent = new EventEmitter<NgForm>();

  /**
   * Bisogna cancellare la sottoscrizione quando andiamo via
   */
  private comboWithRemoteOptionsChangeSubscription: Subscription;

  /**
   * Esegue la callback assegnata a un pulsante generico
   */
  buttonCallback(button: ButtonConfig) {
    button.callback();
  }

  constructor(
    private data: DataService,
    private conditional: ConditionalService,
    private tabsService: TabsService,
    public comboService: ComboService,
    private utility: UtilityService,
    private uploadService: UploaderService,
    private renderer: Renderer2,
    private resetOnChangeService: ResetOnChangeService,
    public valueService: ValueService,
    private externalDataService: ExternalDataService
  ) {
    tabsService.$eventHandler.subscribe(event => {
      if (event.callback === 'nextTab') {
        tabsService.openNextTab(this.form);
      }
    });
  }

  @Input()
  public set form(f: IForm) {
    if (!this.formJson || !this.utility.areObjectsEquivalent(this.formJson, f)) {
      this.shouldEmitReadyEvent = true;
      if (!!this.comboWithRemoteOptionsChangeSubscription) {
        this.comboWithRemoteOptionsChangeSubscription.unsubscribe();
        this.comboWithRemoteOptionsChangeSubscription = null;
      }
      this.formJson = f;
      this.valueService.loadForm(this.formJson)
      this.tryToEmitReadyEvent();
    }
  }

  public get form(): IForm {
    return this.formJson;
  }

  ngOnDestroy(): void {
    /**
     * Cancello l'iscrizione agli eventi di comboWithRemoteOptions
     */
    if (!!this.comboWithRemoteOptionsChangeSubscription) {
      this.comboWithRemoteOptionsChangeSubscription.unsubscribe();
      this.comboWithRemoteOptionsChangeSubscription = null;
    }
  }

  ngOnInit(): void {

    /**
     * Sottoscrizione ai cambiamenti delle opzioni nelle combo con sorgenti dati remote
     */
    this.comboWithRemoteOptionsChangeSubscription = this.comboService.comboWithRemoteOptionsChange.subscribe(list => {
      if (!!this.f) {
        this.comboLoadingList = list;
        this.tryToEmitReadyEvent();
      }
    });
    /**
     * Sottoscrizione a formnReady per registrare il listener su conditional
     */
    this.formReadyEvent.subscribe((f) => {
      this.conditional.registerForm(f, this.externalData);
      this.externalDataService.externalData.emit(this.externalData);
      this.resetOnChangeService.registerForm(f);
    });
  }

  /**
   * Esegue la callback assegnata al pulsante reset
   */
  resetForm() {
    this.f.reset({});
    if (!!this.config.resetCallback) {
      this.config.resetCallback(this.f);
    }
  }

  /**
   * Imposta un elenco di opzioni che saranno utilizzati dall'autocomplete
   * all'interno del componente
   */
  public setListaAutocompleteObjList(e: IFormOptions[]) {
    this.data.changeMessage(e);
  }

  /**
   * Esegue la callback assegnata al pulsante submit
   */
  submitForm($event) {
    if (!!this.uploadServiceSubscription) {
      $event.preventDefault();
      /// Sono in attesa che si completino i downloads
      return;
    }
    if (this.f.valid) {
      this.uploadFiles(() => {
        if (!!this.config.submitCallback) {
          this.config.submitCallback(this.f);
        }
      });
    }
  }

  /**
   * Se è tutto a posto emette l'evento, altrimenti richiama se stessa dopo un po'
   */
  private tryToEmitReadyEvent() {
    if (this.shouldEmitReadyEvent) {
      if (this.comboLoadingList.length === 0 && !!this.f) {
        this.formReadyEvent.emit(this.f);
        this.shouldEmitReadyEvent = false;
      } else {
        setTimeout(() => {
          this.tryToEmitReadyEvent();
        }, 100);
      }
    }
  }

  public uploadFiles(callback) {
    if (!this.uploadService.ready) {
      if (!!this.uploadServiceSubscription) {
        this.uploadServiceSubscription.unsubscribe();
        this.uploadServiceSubscription = null;
      }
      this.uploadServiceSubscription = this.uploadService.uploadElementEvent.subscribe(a => {
        if (!!this.uploadService.ready) {
          this.uploadFiles(callback);
        }
      });
      this.uploadService.uploadAll();
    } else {
      callback();
    }
  }

  /**
   * Imposta il focus su un campo del form
   */
  public setFocus(name: string) {
    const log = (msg: string) => {
      console.log(`%c[setFocus error] ${msg}`, 'background: red; color: white');
    };
    const elementJson: IFormElement = this.utility.getJsonElementByKey(this.form, name);
    if (!elementJson) {
      log(`element ${name} not found in form`);
      return;
    }
    let focusElement: any;
    try {
      focusElement = this.renderer.selectRootElement(`[ng-reflect-name="${name}"]`, true);
    } catch (e) {
      console.log(`%cFocus element not found [${name}]`, 'color: orange');
      return;
    }
    switch (elementJson.type) {
      case 'button':
      case 'email':
      case 'datetime':
      case 'number':
      case 'password':
      case 'phoneNumber':
      case 'textarea':
      case 'textfield':
        if (!!focusElement) {
          focusElement.focus();
        }
        break;
      case 'autocomplete':
        if (!!focusElement) {
          focusElement.click();
        }
        break;
      case 'select':
        (focusElement as MatSelect).focus();
        break;
      case 'checkbox':
        (document.querySelector(`[id^="${name}-"]`) as HTMLInputElement).focus();
        focusElement.classList.add('cdk-focused');
        focusElement.classList.add('cdk-keyboard-focused');
        break;
      case 'selectboxes':
        focusElement = (document.querySelector(`.mrf-selectboxes-${name}`) as HTMLInputElement);
        (document.querySelector(`.mrf-selectboxes-${name} input`) as HTMLInputElement).focus();
        focusElement.classList.add('cdk-focused');
        focusElement.classList.add('cdk-keyboard-focused');
        break;
      case 'objectList':
      case 'objectList2':
        (document.querySelector(`#mrf-objectlist-${name}`) as HTMLButtonElement).click();
        break;
      case 'chips':
        (document.querySelector(`.mrf-chips-${name}`) as HTMLInputElement).click();
        break;
      case 'file':
        (document.querySelector(`.mrf-upload-${name}`) as HTMLButtonElement).click();
        break;
      case 'map':
        (document.querySelector(`.mrf-map-${name}`) as HTMLButtonElement).click();
        break;
      case 'radio':
        focusElement = document.querySelector(`.mrf-radio-${name}`);
        focusElement.focus();
        focusElement.classList.add('cdk-focused');
        focusElement.classList.add('cdk-keyboard-focused');
        break;
      default:
        console.log(elementJson);
        break;
    }
  }

  public get value(): any {
    const visibleElements: string[] = this.utility.getVisibleElementsList(this.form);
    const value: { [key: string]: any } = {};
    if (!!this.f) {
      const currentFormValue = this.f.control.getRawValue();
      for (const key in currentFormValue) {
        if (currentFormValue.hasOwnProperty(key)) {
          if (!this.utility.isNullOrUndefined(currentFormValue[key])) {
            if (visibleElements.includes(key.split(':')[0])) {
              value[key] = currentFormValue[key];
            }
          }
        }
      }
    }
    return value;
  }
}

export interface FormContainerConfig {
  showSubmit?: boolean;
  submitLabel?: string;
  submitIcon?: string;
  submitCallback?: (f: NgForm) => void;

  showReset?: boolean;
  resetLabel?: string;
  resetIcon?: string;
  resetCallback?: (f: NgForm) => void;

  buttons?: ButtonConfig[];
}

export interface ButtonConfig {
  label?: string;
  icon?: string;
  callback?: () => void;
}
