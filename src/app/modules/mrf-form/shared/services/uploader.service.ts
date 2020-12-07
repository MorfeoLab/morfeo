import {EventEmitter, Injectable} from '@angular/core';
import {UploadElementComponent} from '../../form-element/upload-element/upload-element.component';
import {UtilityService} from "./utility/utility.service";

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  /**
   * Un elenco di tutti i componenti upload
   */
  uploadElements: UploadElementComponent[] = [];

  /**
   * Una mappa di url per upload
   */
  private uploadTargets: {[key: string]: string} = {};

  /**
   * Una mappa di url per upload
   */
  private downloadFiles: {[key: string]: string} = {};

  /**
   * Una mappa che contiene dati aggiuntivi che verranno mandati assieme al file in POST
   */
  private uploadAdditionalData: {[key: string]: any} = {};

  /**
   * Event Emitter che viene scatenato ad ogni fine upload o errore
   */
  public uploadElementEvent: EventEmitter<string> = new EventEmitter<string>();

  private actionTrigger: EventEmitter<string> = new EventEmitter();

  constructor(
      private utils: UtilityService
  ) {
  }

  public get ready(): boolean {
    let counter = 0;
    for (const el of this.uploadElements) {
      for (const file of el.files) {
        if (file.progress < 100) {
          counter++;
        }
      }
    }
    return counter === 0;
  }

  public emitEvent() {
    this.uploadElementEvent.emit('changed');
  }


  public getActionTrigger() {
    return this.actionTrigger;
  }

  public registerControl(e: UploadElementComponent) {
    this.uploadElements.push(e);
  }

  public unregisterControl(e: UploadElementComponent) {
    this.uploadElements.filter((el: UploadElementComponent) => {
      return e.field.key !== el.field.key;
    })
  }

  /**
   * Fa partire l'upload di tutti gli elementi
   */
  public uploadAll() {
    for (const el of this.uploadElements) {
      el.uploadFiles();
    }
  }

  public uploadFailed(response) {
    this.actionTrigger.emit(response);
    this.uploadElementEvent.emit('failed');
  }

  public uploadCompleted(response) {
    this.actionTrigger.emit(response);
    this.uploadElementEvent.emit('uploaded');
  }

  public uploadDeleted() {
    this.actionTrigger.emit('deleted');
  }

  public getUploadElement(nome: string): UploadElementComponent {
    for (const el of this.uploadElements) {
      if (el.field.key + el.field.suffix === nome) {
        return el;
      }
    }
    return null;
  }

  /**
   * Memorizza l'url di upload in base a un ID
   */
  public setTarget(key: string, value: string): void {
    this.uploadTargets[key] = value;
  }

  /**
   * Restituisce l'url di upload in base a un ID
   */
  public getTarget(key: string): string {
    if (this.uploadTargets.hasOwnProperty(key)) {
      return this.uploadTargets[key];
    }
    return '';
  }

  /**
   * Memorizza l'url di download in base a un ID
   */
  public setDownload(key: string, value: string): void {
    this.downloadFiles[key] = value;
  }

  /**
   * Restituisce l'url di download in base a un ID
   */
  public getDownload(key: string): string {
    if (this.downloadFiles.hasOwnProperty(key)) {
      return this.downloadFiles[key];
    }
    return '';
  }

  /**
   * Memorizza un oggetto aggiuntivo da inviare in post assieme all'upload
   */
  public setAdditionalData(key: string, value: {[k: string]: any}): void {
    this.uploadAdditionalData[key] = value;
  }

  /**
   * Restituisce l'url di upload in base a un ID
   */
  public getAdditionalData(key: string): {[k: string]: any} {
    if (this.uploadAdditionalData.hasOwnProperty(key)) {
      return this.uploadAdditionalData[key];
    }
    return {};
  }

}
