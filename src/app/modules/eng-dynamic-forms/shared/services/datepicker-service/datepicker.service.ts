import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {
  private filterFunctions: {[key: string]: (d: Date) => boolean} = {};


  constructor() { }

  public registerFilter(key: string, filter: (d: Date) => boolean): void {
    this.filterFunctions[key] = filter;
  }

  public getFilter(key)  {
    return this.filterFunctions[key];
  }


}
