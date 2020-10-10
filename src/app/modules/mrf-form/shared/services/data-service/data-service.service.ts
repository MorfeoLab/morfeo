import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {NgForm} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private URL: string;

  constructor(private httpClient: HttpClient) {}

  private domandePreliminari = new BehaviorSubject([{value: '', label: ''}]);
  currentDomande = this.domandePreliminari.asObservable();

  changeMessage(value: any) {
    this.domandePreliminari.next(value);
  }


  /**
   * @method displayFn
   * @description Funzione di rendering per gli elementi dell'Autocomplete
   * @param options - add description
   */
  displayFn(options?: any): string | undefined {
    return options ? options.label : undefined;
  }

  public set url(url: string) {
    this.URL = url;
  }

  public get url(): string {
    return this.URL;
  }

  public getResource(serviceUrl: string) {
    return this.httpClient.get(serviceUrl);
  }

  public getResourceByName(serviceName: string) {
    return this.getResource(this.URL + serviceName);
  }

  public setResource(serviceUrl: string, data: any) {
    return this.httpClient.post(serviceUrl, data);
  }

  public setResourceByName(serviceName: string, data: any) {
    return this.setResource(this.URL + serviceName, data);
  }

  public setResources(serviceUrl: string, data: any[]) {
    const requests: Observable<any>[] = [];
    data.forEach(item => {
      requests.push(this.httpClient.post(serviceUrl, data));
    });
    return forkJoin(requests);
  }

  public setResourcesByName(serviceName: string, data: any) {
    return this.setResources(this.URL + serviceName, data);
  }

  public updateResource(serviceUrl: string, data: any) {
    return this.httpClient.put(serviceUrl, data);
  }

  public updateResourceByName(serviceName: string, data: any) {
    return this.updateResource(this.URL + serviceName, data);
  }

  public createResource(serviceUrl: string, data) {
    return this.httpClient.post(serviceUrl, data);
  }

  public createResourceByName(serviceName: string, data) {
    return this.createResource(this.URL + serviceName, data);
  }

  public deleteResource(serviceUrl: string, id: string | number) {
    return this.httpClient.delete(serviceUrl + '/' + id);
  }

  public deleteResourceByName(serviceName: string, id: string | number) {
    return this.deleteResource(this.URL + serviceName, id);
  }

  public getResourceByMethod(serviceUrl: string, method: string, params: any) {
    if (method === 'POST') {
      return this.httpClient.post(serviceUrl, params);
    } else {
      for (const param in params) {
        if (params.hasOwnProperty(param)) {
          serviceUrl = this.appendQueryParam(serviceUrl, param, params[param]);
        }
      }
      return this.httpClient.get(serviceUrl, params);
    }
  }

  public getPaginated(
    path: string,
    page: number,
    size: number,
    sortField: string,
    order: string,
    searchElMap: any
  ) {
    let finalUrl = path + '/' + page + '/' + size;
    if (!!sortField) {
      finalUrl = this.appendQueryParam(finalUrl, 'sortField', sortField);
    }
    if (!!order) {
      finalUrl = this.appendQueryParam(finalUrl, 'order', order);
    }
    for (const key in searchElMap) {
      if (searchElMap.hasOwnProperty(key)) {
        let value = searchElMap[key];
        if (key === 'last' && value === false) {
          value = '';
        }
        if (value !== undefined && value !== '') {
          if (value instanceof Date || value.constructor.name === 'Moment') {
            value = value.toJSON();
          }
          finalUrl = this.appendQueryParam(finalUrl, key, value);
        }
      }
    }
    return this.getResource(finalUrl);
  }

  public getPaginatedList(path: string, page: number, size: number, sortField: string, order: string, searchElMap: any) {
    return this.getPaginated(path, page, size, sortField, order, searchElMap);
  }

  appendQueryParam(url: string, name: string, value: string): string {
    if (url.includes('?')) {
      url += '&';
    } else {
      url += '?';
    }
    url += name;
    url += '=';
    url += value;
    return url;
  }

  /**
   * Effettua merge dei params di richiesta con i parametri configurabili con i valori di altri id semantici.
   *
   * @param params i parametri di ricerca
   * @param configurableParams i paramtri configurabili
   * @param formRef la reference al form
   */
  public mergeParams(params: any, configurableParams: any, formRef: NgForm) {
    Object.keys(configurableParams).forEach(v => {
      if (!!formRef.controls[configurableParams[v]]
        && !!formRef.controls[configurableParams[v]].value) {
        const valueOfKey = formRef.controls[configurableParams[v]].value;
        if (valueOfKey instanceof Date || valueOfKey.constructor.name === 'Moment') {
          params[v] = valueOfKey.toJSON();
        } else if (valueOfKey.hasOwnProperty('value')) {
          params[v] = valueOfKey.value;
        } else if (valueOfKey !== '') {
          params[v] = valueOfKey;
        }
      }
    });
  }
}
