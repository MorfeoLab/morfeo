import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MultiTranslateHttpLoader} from './modules/mrf-form/shared/loaders/multi-translate-http.loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http,  '/assets/i18n/', '.json');
    // return new MultiTranslateHttpLoader(http, [
    //     {
    //         prefix: '/assets/i18n/', suffix: '.json'
    //     },
    //     {
    //         prefix: '/assets/i18n/morfeo/', suffix: '.json'
    //     }
    // ]);
}


@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        // CommonModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })


        // ReactiveFormsModule,
        // MaterialImportsModule,
        // FormsModule,
    ],
    providers: [
        TranslateModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
