import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComboService {

  /**
   * Elenco di tutte le COMBO
   */
  private comboList: {[key: string]: { value: string; label: string }[]} = {};

  /**
   * Elenco degli id di tutte le COMBO che necessitano di caricare dati
   */
  private comboWithRemoteOptions: string[] = [];

  /**
   * EventEmitter che notifica il cambiamento delle opzioni di una select
   */
  public collectionChange = new EventEmitter();

  /**
   * EventEmitter che notifica il cambiamento dell'elenco di combo con sorgente dati remota
   */
  public comboWithRemoteOptionsChange = new EventEmitter<string[]>();

  constructor() { }

  /**
   * Cambia le opzioni disponibili di una Select
   * @param key L'id univoco del campo
   * @param values I valori da utilizzare
   */
  public setList(key: string, values: any[]) {
    this.comboList[key] = values;
    this.collectionChange.emit({key, list: this.comboList[key]} );
  }

  /**
   * Aggiunge l'id di una combo all'elenco di attesa
   * @param s l'id univoco della combo
   */
  public registerComboWithRemoteData(s: string) {
    if (!this.comboWithRemoteOptions.includes(s)) {
      this.comboWithRemoteOptions.push(s);
      this.emitComboWithRemoteOptionsChange();
    } else {
      console.warn(`[registerComboWithRemoteData] Stai registrando due volte ${s}?`);
    }
  }

  /**
   * Rimuove l'id di una combo dall'elenco di attesa
   * @param s l'id univoco della combo
   */
  public unregisterComboWithRemoteData(s: string) {
    if (this.comboWithRemoteOptions.includes(s)) {
      this.comboWithRemoteOptions = this.comboWithRemoteOptions.filter(item => item !== s);
      this.emitComboWithRemoteOptionsChange();
    }
  }

  public emitComboWithRemoteOptionsChange() {
    this.comboWithRemoteOptionsChange.emit(this.comboWithRemoteOptions);
  }
}
