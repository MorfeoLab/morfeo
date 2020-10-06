import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {share, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CacheRegistryInterceptor implements HttpInterceptor {

  private cacheTime = 300000; /// milliseconds
  private cachedData: {
    [key: string]: {
      response: any,
      timestamp: number
    }
  } = {};

  constructor() {
  }

  public intercept(httpRequest: HttpRequest<any>, handler: HttpHandler) {

    let requestId = httpRequest.urlWithParams;
    if (!!httpRequest.body) {
      for (const prop of Object.keys(httpRequest.body).sort()) {
        requestId += '-' + prop;
        if (httpRequest.body.hasOwnProperty(prop)) {
          requestId += ':' + (httpRequest.body[prop] || '');
        }
      }
    }
    // Don't cache if
    // 1. It's not a GET or POST request
    // 2. cache only invoke interope-api
    if (['GET', 'POST'].indexOf(httpRequest.method) < 0 ||
      !httpRequest.url.match('interoperabilita\/servizi\/.*\/invoke')) {
      return handler.handle(httpRequest);
    }

    // Also leave scope of resetting already cached data for a URI
    if (httpRequest.headers.get('reset-cache')) {
      delete this.cachedData[requestId];
    }

    // Checked if there is cached data for this URI
    const lastResponse = this.cachedData[requestId];
    if (lastResponse && Date.now() - this.cachedData[requestId].timestamp < this.cacheTime) {
      // In case of parallel requests to same URI,
      // return the request already in progress
      // otherwise return the last cached data
      return (lastResponse.response instanceof Observable)
        ? lastResponse.response : of(lastResponse.response.clone());
    }

    // If the request of going through for first time
    // then let the request proceed and cache the response
    const requestHandle = handler
      .handle(httpRequest)
      .pipe(
        tap((stateEvent) => {
          if (stateEvent instanceof HttpResponse) {
            this.cachedData[requestId].response = stateEvent.clone();
          }
        }), share());

    // Meanwhile cache the request Observable to handle parallel request
    this.cachedData[requestId] = {
      response: requestHandle,
      timestamp: Date.now()
    };

    return requestHandle;
  }

}
