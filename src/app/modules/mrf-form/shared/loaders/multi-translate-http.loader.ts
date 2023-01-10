import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as merge from 'lodash/merge';

export class MultiTranslateHttpLoader implements TranslateLoader {
    constructor(
        private http: HttpClient,
        public resources: { prefix: string, suffix: string }[] = [{ prefix: '/assets/i18n/', suffix: '.json' }]) {}
    public getTranslation(lang: string): any {
        return forkJoin(this.resources.map(config => {
            return this.http.get(`${config.prefix}${lang}${config.suffix}`);
        })).pipe(map(response => {
            return response.reduce((a, b) => {
                return merge(a, b); // Object.assign(a, b);
            });
        }));
    }
}
