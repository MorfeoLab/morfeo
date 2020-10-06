import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExternalDataService {

  @Output() externalData: EventEmitter<{ [key: string]: any }> = new EventEmitter();

  constructor() {
  }
}
