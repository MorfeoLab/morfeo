import {MaterialImportsModule} from '../imports/material-imports.module';
import {EngDynamicFormsComponent, MrfFormComponent} from './mrf-form.component';
import {DebugObjectComponent} from './shared/components/debug-object/debug-object.component';
import {ModalComponent} from './shared/components/modal/modal.component';
import {StringToHtmlPipe} from './shared/pipes/string-to-html/string-to-html.pipe';
import {TranslatablePipe} from './shared/pipes/translatable/translatable.pipe';
import {RegisterFormModelDirective} from './shared/directives/register-form-model/register-form-model.directive';
import {FormElementComponent} from './form-element/form-element.component';
import {TooltipButtonComponent} from './form-element/tooltip-button/tooltip-button.component';
import {RepeatableContainerComponent} from './layout/repeatable-container/repeatable-container.component';
import {AutocompleteElementComponent} from './form-element/autocomplete-element/autocomplete-element.component';
import {ComboElementComponent} from './form-element/combo-element/combo-element.component';
import {ButtonElementComponent} from './form-element/button-element/button-element.component';
import {CheckboxElementComponent} from './form-element/checkbox-element/checkbox-element.component';
import {ChipsElementComponent} from './form-element/chips-element/chips-element.component';
import {HtmlElementComponent} from './form-element/html-element/html-element.component';
import {TextAreaElementComponent} from './form-element/text-area-element/text-area-element.component';
import {SelectBoxesComponent} from './form-element/select-boxes/select-boxes.component';
import {RadioElementComponent} from './form-element/radio-element/radio-element.component';
import {MapElementComponent} from './form-element/map-element/map-element.component';
import {DateElementComponent} from './form-element/date-element/date-element.component';
import {LayoutColumnsComponent} from './layout/layout-columns/layout-columns.component';
import {LayoutContainerComponent} from './layout/layout-container/layout-container.component';
import {LayoutTablesComponent} from './layout/layout-tables/layout-tables.component';
import {LayoutTabsComponent} from './layout/layout-tabs/layout-tabs.component';
import {LayoutFieldsetComponent} from './layout/layout-fieldset/layout-fieldset.component';
import {ListModalComponent} from './shared/components/list-modal/list-modal.component';
import {TestComponentComponent} from './test-component/test-component.component';
import {TestPageComponent} from './test-page/test-page.component';
import {ObjectListSelectorComponent} from './form-element/object-list-selector/object-list-selector.component';
import {ObjectListSelectorModalComponent} from './form-element/object-list-selector/object-list-selector-modal/object-list-selector-modal.component';
import {BytesPipe} from './shared/pipes/bytes/bytes.pipe';
import {ReadOnlyComponent} from './form-element/read-only/read-only.component';
import {ReadOnlyKeyvalueComponent} from './form-element/read-only/read-only-keyvalue/read-only-keyvalue.component';
import {ReadOnlyTradComponent} from './form-element/read-only/read-only-trad/read-only-trad.component';
import {ReadOnlyFileComponent} from './form-element/read-only/read-only-file/read-only-file.component';
import {ReadOnlyDateComponent} from './form-element/read-only/read-only-date/read-only-date.component';
import {ReadOnlyObjectlistComponent} from './form-element/read-only/read-only-objectlist/read-only-objectlist.component';
import {UploadElementComponent} from './form-element/upload-element/upload-element.component';
import {UploadConfirmComponent} from './form-element/upload-element/upload-confirm/upload-confirm.component';
import {WysiwygElementComponent} from './form-element/wysiwyg-element/wysiwyg-element.component';
import {TextMultilinguaComponent} from './form-element/text-multilingua/text-multilingua.component';
import {ValidateJsonRuleDirective} from './shared/directives/validate-json-rule/validate-json-rule.directive';
import {SnackBarCustomComponent} from './shared/components/snack-bar-custom/snack-bar-custom.component';
import {JsonRuleElementComponent} from './form-element/json-rule-element/json-rule-element.component';
import {JsonRulesListElementComponent} from './form-element/json-rules-list-element/json-rules-list-element.component';
import {ObjectListModalComponent} from './form-element/object-list/object-list-modal/object-list-modal.component';
import {ObjectListComponent} from './form-element/object-list/object-list.component';
import {ObjRulesModalComponent} from './form-element/object-list/obj-rules-modal/obj-rules-modal.component';
import {OnlyBooleanPipe} from './shared/pipes/only-boolean/only-boolean.pipe';
import {UploadValidationDirective} from './form-element/upload-element/upload-validation.directive';
import {ReadOnlyWysiwygComponent} from './form-element/read-only/read-only-wysiwyg/read-only-wysiwyg.component';
import {HtmlBoxElementComponent} from './form-element/html-box-element/html-box-element.component';
import {ElementWrapperComponent} from './form-element/element-wrapper/element-wrapper.component';
import {CacheRegistryInterceptor} from './cache/cache-registry.interceptor';
import {DataTableComponent} from './form-element/data-table/data-table.component';
import {GenericButtonComponent} from './shared/components/generic-button/generic-button.component';
import {TextElementComponent} from './form-element/text-element/text-element.component';
import {CodeEditorElementComponent} from './form-element/code-editor-element/code-editor-element.component';
import {DatetimeElementComponent} from './form-element/datetime-element/datetime-element.component';
import {ValidateCustomDirective} from './shared/directives/validate-custom/validate-custom.directive';
import { LeftMenuComponent } from './layout/left-menu/left-menu.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const COMBO_ELEMENT_VALUE = {};

export const declarationList = [
    AutocompleteElementComponent,
    ButtonElementComponent,
    BytesPipe,
    CheckboxElementComponent,
    ChipsElementComponent,
    ComboElementComponent,
    DataTableComponent,
    DateElementComponent,
    DatetimeElementComponent,
    DebugObjectComponent,
    ElementWrapperComponent,
    EngDynamicFormsComponent,
    FormElementComponent,
    GenericButtonComponent,
    HtmlBoxElementComponent,
    HtmlElementComponent,
    JsonRuleElementComponent,
    JsonRulesListElementComponent,
    LayoutColumnsComponent,
    LayoutContainerComponent,
    LayoutFieldsetComponent,
    LayoutTablesComponent,
    LayoutTabsComponent,
    LeftMenuComponent,
    ListModalComponent,
    MapElementComponent,
    ModalComponent,
    MrfFormComponent,
    ObjectListComponent,
    ObjectListModalComponent,
    ObjectListSelectorComponent,
    ObjectListSelectorModalComponent,
    ObjRulesModalComponent,
    OnlyBooleanPipe,
    RadioElementComponent,
    ReadOnlyComponent,
    ReadOnlyKeyvalueComponent,
    ReadOnlyTradComponent,
    ReadOnlyFileComponent,
    ReadOnlyDateComponent,
    ReadOnlyObjectlistComponent,
    ReadOnlyWysiwygComponent,
    RegisterFormModelDirective,
    RepeatableContainerComponent,
    SelectBoxesComponent,
    SnackBarCustomComponent,
    StringToHtmlPipe,
    TestComponentComponent,
    TestPageComponent,
    TextAreaElementComponent,
    TextElementComponent,
    CodeEditorElementComponent,
    TextMultilinguaComponent,
    TooltipButtonComponent,
    TranslatablePipe,
    UploadConfirmComponent,
    UploadElementComponent,
    UploadValidationDirective,
    ValidateCustomDirective,
    ValidateJsonRuleDirective,
    WysiwygElementComponent
];

export const importsList = [
    CommonModule,
    ReactiveFormsModule,
    MaterialImportsModule,
    CodemirrorModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
];

export const exportsList = [
    AutocompleteElementComponent,
    ButtonElementComponent,
    CheckboxElementComponent,
    ChipsElementComponent,
    ComboElementComponent,
    DateElementComponent,
    DebugObjectComponent,
    EngDynamicFormsComponent,
    FormElementComponent,
    HtmlElementComponent,
    JsonRuleElementComponent,
    JsonRulesListElementComponent,
    LeftMenuComponent,
    MapElementComponent,
    MrfFormComponent,
    OnlyBooleanPipe,
    RadioElementComponent,
    ReadOnlyComponent,
    ReadOnlyDateComponent,
    ReadOnlyFileComponent,
    ReadOnlyKeyvalueComponent,
    ReadOnlyObjectlistComponent,
    ReadOnlyTradComponent,
    ReadOnlyWysiwygComponent,
    RepeatableContainerComponent,
    SelectBoxesComponent,
    TextAreaElementComponent,
    TextElementComponent,
    CodeEditorElementComponent,
    TextMultilinguaComponent,
    TooltipButtonComponent,
    TranslatablePipe,
    UploadConfirmComponent,
    WysiwygElementComponent
];

export const providersList = [
    TranslatablePipe,
    OnlyBooleanPipe,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: CacheRegistryInterceptor,
        multi: true
    },
    {
        provide: ComboElementComponent,
        useValue: COMBO_ELEMENT_VALUE
    },
    {
        provide: MAT_DATE_LOCALE,
        useValue: 'it'
    },
];

export const entryComponentsList = [
    /// MODALS
    ListModalComponent,
    SnackBarCustomComponent,
    ObjectListSelectorModalComponent,
    ObjectListModalComponent,
    ObjRulesModalComponent,
    UploadConfirmComponent,
    /// LAYOUTS
    LayoutColumnsComponent,
    LayoutContainerComponent,
    LayoutFieldsetComponent,
    RepeatableContainerComponent,
    LayoutTablesComponent,
    LayoutTabsComponent,
    LayoutContainerComponent,
    /// FIELDS
    AutocompleteElementComponent,
    ButtonElementComponent,
    CheckboxElementComponent,
    ChipsElementComponent,
    ComboElementComponent,
    DataTableComponent,
    DateElementComponent,
    JsonRuleElementComponent,
    JsonRulesListElementComponent,
    MapElementComponent,
    ObjectListSelectorComponent,
    ObjectListComponent,
    RadioElementComponent,
    SelectBoxesComponent,
    TextAreaElementComponent,
    TextElementComponent,
    CodeEditorElementComponent,
    TextMultilinguaComponent,
    UploadElementComponent,
    /// READ ONLY
    ReadOnlyComponent,
    ReadOnlyKeyvalueComponent,
    ReadOnlyTradComponent,
    ReadOnlyFileComponent,
    ReadOnlyDateComponent,
    ReadOnlyObjectlistComponent,
    ReadOnlyWysiwygComponent,
    /// EXTRAS
    HtmlBoxElementComponent,
    HtmlElementComponent,
    WysiwygElementComponent,
];

// TODO - check if we need to export all components or just MrfFormComponent
@NgModule({
    declarations: [
        declarationList
    ],
    imports: [
        importsList,
        RouterModule
    ],
    exports: exportsList,
    providers: providersList,
    entryComponents: entryComponentsList
})
export class MrfFormModule {
}
