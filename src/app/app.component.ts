import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'mrf-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'morfeo';

    constructor(
        private translate: TranslateService
    ) {


        translate.addLangs(['it', 'en']);
        translate.setDefaultLang('it');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|it/) ? browserLang : 'it');
    }
}
