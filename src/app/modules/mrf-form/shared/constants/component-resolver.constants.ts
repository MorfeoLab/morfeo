import {IFormElement} from '../models/form-element.model';
import {NgForm} from '@angular/forms';
import {LayoutColumnsComponent} from '../../layout/layout-columns/layout-columns.component';
import {LayoutContainerComponent} from '../../layout/layout-container/layout-container.component';
import {LayoutFieldsetComponent} from '../../layout/layout-fieldset/layout-fieldset.component';
import {RepeatableContainerComponent} from '../../layout/repeatable-container/repeatable-container.component';
import {LayoutTablesComponent} from '../../layout/layout-tables/layout-tables.component';
import {LayoutTabsComponent} from '../../layout/layout-tabs/layout-tabs.component';
import {AutocompleteElementComponent} from '../../form-element/autocomplete-element/autocomplete-element.component';
import {ButtonElementComponent} from '../../form-element/button-element/button-element.component';
import {CheckboxElementComponent} from '../../form-element/checkbox-element/checkbox-element.component';
import {ChipsElementComponent} from '../../form-element/chips-element/chips-element.component';
import {DateElementComponent} from '../../form-element/date-element/date-element.component';
import {UploadElementComponent} from '../../form-element/upload-element/upload-element.component';
import {ObjectListSelectorComponent} from '../../form-element/object-list-selector/object-list-selector.component';
import {MapElementComponent} from '../../form-element/map-element/map-element.component';
import {TextMultilinguaComponent} from '../../form-element/text-multilingua/text-multilingua.component';
import {RadioElementComponent} from '../../form-element/radio-element/radio-element.component';
import {ComboElementComponent} from '../../form-element/combo-element/combo-element.component';
import {SelectBoxesComponent} from '../../form-element/select-boxes/select-boxes.component';
import {TextAreaElementComponent} from '../../form-element/text-area-element/text-area-element.component';
import {TextElementComponent} from '../../form-element/text-element/text-element.component';
import {HtmlElementComponent} from '../../form-element/html-element/html-element.component';
import {WysiwygElementComponent} from '../../form-element/wysiwyg-element/wysiwyg-element.component';
import {ReadOnlyKeyvalueComponent} from '../../form-element/read-only/read-only-keyvalue/read-only-keyvalue.component';
import {ReadOnlyDateComponent} from '../../form-element/read-only/read-only-date/read-only-date.component';
import {ReadOnlyFileComponent} from '../../form-element/read-only/read-only-file/read-only-file.component';
import {ReadOnlyComponent} from '../../form-element/read-only/read-only.component';
import {ReadOnlyObjectlistComponent} from '../../form-element/read-only/read-only-objectlist/read-only-objectlist.component';
import {JsonRuleElementComponent} from '../../form-element/json-rule-element/json-rule-element.component';
import {JsonRulesListElementComponent} from '../../form-element/json-rules-list-element/json-rules-list-element.component';
import {ObjectListComponent} from '../../form-element/object-list/object-list.component';
import {ReadOnlyWysiwygComponent} from '../../form-element/read-only/read-only-wysiwyg/read-only-wysiwyg.component';
import {HtmlBoxElementComponent} from '../../form-element/html-box-element/html-box-element.component';
import {DataTableComponent} from '../../form-element/data-table/data-table.component';
import {ReadOnlyTradComponent} from '../../form-element/read-only/read-only-trad/read-only-trad.component';
import {DataSelectComponent} from '../../form-element/data-select/data-select.component';

export interface ComponentBase {
    externalData: { [key: string]: any };
    field: IFormElement;
    formRef: NgForm;
    readOnly: boolean;
}

export interface ComponentResolver {
    [key: string]: {
        input: any,
        output: any
    };
}

export const COMPONENT_RESOLVER: ComponentResolver = {
    // LAYOUT ELEMENTS
    columns: {
        // LAYOUT: COLUMNS
        input: LayoutColumnsComponent,
        output: LayoutColumnsComponent,
    },
    container: {
        // LAYOUT: CONTAINER
        input: LayoutContainerComponent,
        output: LayoutContainerComponent,
    },
    fieldset: {
        // LAYOUT: FIELDSET
        input: LayoutFieldsetComponent,
        output: LayoutFieldsetComponent,
    },
    repeatable: {
        // LAYOUT: REPEATABLE
        input: RepeatableContainerComponent,
        output: RepeatableContainerComponent,
    },
    table: {
        // LAYOUT: TABLE
        input: LayoutTablesComponent,
        output: LayoutTablesComponent,
    },
    tabs: {
        // LAYOUT: TABS
        input: LayoutTabsComponent,
        output: LayoutTabsComponent,
    },
    well: {
        // LAYOUT: WELL
        input: LayoutContainerComponent,
        output: LayoutContainerComponent,
    },
    // FIELD ELEMENTS
    autocomplete: {
        // FIELD: AUTOCOMPLETE
        input: AutocompleteElementComponent,
        output: ReadOnlyKeyvalueComponent,
    },
    button: {
        // FIELD: BUTTON
        input: ButtonElementComponent,
        output: '',
    },
    actionbutton: {
        // FIELD: BUTTON
        input: ButtonElementComponent,
        output: '',
    },
    checkbox: {
        // FIELD: CHECKBOX
        input: CheckboxElementComponent,
        output: CheckboxElementComponent,
    },
    chips: {
        // FIELD: CHIPS
        input: ChipsElementComponent,
        output: ReadOnlyKeyvalueComponent,
    },
    dataTable: {
        /// FIELD: TABLE
        input: DataTableComponent,
        output: ''
    },
    dataSelect: {
        /// Nuova versione di ObjectList
        input: DataSelectComponent,
        output: ''
    },
    datetime: {
        // FIELD: DATE
        input: DateElementComponent,
        output: ReadOnlyDateComponent,
    },
    email: {
        // FIELD: TEXT
        input: TextElementComponent,
        output: ReadOnlyComponent,
    },
    file: {
        // INPUT: FILE
        input: UploadElementComponent,
        output: ReadOnlyFileComponent,
    },
    jsonRule: {
        /// FIELD JSON_LOGIC STRING
        input: JsonRuleElementComponent,
        output: ReadOnlyComponent
    },
    jsonRulesList: {
        /// FIELD JSON_LOGIC STRING
        input: JsonRulesListElementComponent,
        output: ReadOnlyComponent
    },
    map: {
        // FIELD: MAP
        input: MapElementComponent,
        output: ReadOnlyTradComponent
    },
    mapArea: {
        // FIELD: MULTILINGUA
        input: TextMultilinguaComponent,
        output: ReadOnlyTradComponent,
    },
    mapHtml: {
        // WYSIWYG ELEMENT
        input: WysiwygElementComponent,
        output: ReadOnlyWysiwygComponent,
    },
    number: {
        // FIELD: NUMBER
        input: TextElementComponent,
        output: ReadOnlyComponent,
    },
    objectList: {
        // INPUT: OBJECT LIST
        input: ObjectListSelectorComponent,
        output: ReadOnlyObjectlistComponent,
    },
    objectList2: {
        // INPUT: OBJECT LIST 2
        input: ObjectListComponent,
        output: ReadOnlyObjectlistComponent,
    },
    password: {
        input: TextElementComponent,
        output: ReadOnlyComponent
    },
    radio: {
        // FIELD: RADIO
        input: RadioElementComponent,
        output: ReadOnlyComponent,
    },
    select: {
        // FIELD: SELECT
        input: ComboElementComponent,
        output: ReadOnlyComponent,
    },
    selectboxes: {
        // FIELD: LIST OF CHECKBOXES
        input: SelectBoxesComponent,
        output: SelectBoxesComponent,
    },
    telephone: {
        // FIELD: TEXT
        input: TextElementComponent,
        output: ReadOnlyComponent,
    },
    textarea: {
        // FIELD: TEXTAREA
        input: TextAreaElementComponent,
        output: ReadOnlyComponent,
    },
    textfield: {
        // FIELD: TEXT
        input: TextElementComponent,
        output: ReadOnlyComponent,
    },
    image: {
        // FIELD: TEXT
        input: TextElementComponent,
        output: ReadOnlyComponent,
    },
    // EXTRAS
    htmlelement: {
        // EXTRA: HTML ELEMENT
        input: HtmlElementComponent,
        output: HtmlElementComponent,
    },
    htmlbox: {
        // EXTRA: BLOCKQUOTE ELEMENT
        input: HtmlBoxElementComponent,
        output: HtmlBoxElementComponent,
    }
};
