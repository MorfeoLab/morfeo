/**
 * Main form object
 */
import {JsonLogicNode} from '../../form-element/json-rule-element/json-rule-element.component';

export interface IForm {
    components: IFormElement[];

    display?: 'wizard' | 'form';
    numPages?: number;
    page?: number;
    readOnly?: boolean;
    title?: string;
    expanded?: boolean;
    avoidLowerCase?: boolean;

}

/**
 * Option for select and radio buttons
 */
export interface IFormOptions {
    label: string;
    value: string;
    shortcut?: string;
}

export interface IFormTooltip {
    text: string;
    position?: 'above' | 'below' | 'left' | 'right' | 'before' | 'after';
}

/**
 * DataTable Column
 */
export interface IFormTableColumn extends IFormOptions {
    buttons?: IFormButton[];
    buttonGroup?: {
        buttons?: IFormButton[];
        label?: string;
        icon?: string;
        tooltip?: IFormTooltip;
        color?: IFormButtonColor
        style?: IFormButtonStyle;
    };
    cellTooltip?: string;
    dataType?: 'string' | 'number' | 'boolean';
    filterable?: boolean;
    hidden?: boolean | string;
    localized?: boolean;
    renderer?: string;
    sortable?: boolean;
    sortDefault?: boolean;
    sortDirectionDefault?: 'asc' | 'desc';
    style?: IFormStyle;
    tooltip?: IFormTooltip;
}

export interface IFormStyle {
    width?: string;
    height?: string;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

export interface IFormButton {
    disabled?: boolean;
    label?: string;
    icon?: string;
    action?: string;
    tooltip?: IFormTooltip;
    color?: IFormButtonColor;
    style?: IFormButtonStyle;
    content?: {
        copy: {
            from: string;
            to: string;
        }[]
    };
}

/**
 * AJAX Response
 */
export interface IFormAjaxResponse<T> {
    records: T[];
    pagination: IFormAjaxResponsePaginator;
}

export interface IFormAjaxResponsePaginator {
    totalPages?: number;
    totalRecords?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface IFormPageEventData {
    length?: number;
    pageIndex?: number;
    pageSize?: number;
    previousPageIndex?: number;
}

/**
 * Columns
 */
export interface IFormColumn {
    components: IFormElement[];
    type?: 'column';
    width?: number | string;
    offset?: number | string;
    push?: number | string;
    suffix?: string;
    pull?: number | string;
    hideOnChildrenHidden?: boolean;
    input?: boolean;
    key?: string;
    tableView?: boolean | 'true';
    label?: string;
}

/**
 * Conditional rules set
 */
export interface IFormConditional {
    show?: boolean | string;
    when?: string;
    eq?: boolean | string;
    json?: string | object;
}

export interface IFormElementAttributes {
    value: string;
    attr: string;
}

export interface IFormElementValidation {
    custom?: boolean | string | JsonLogicNode[];
    customMessage?: string;
    customPrivate?: boolean;
    json?: string;
    pattern?: string;
    preset?: 'codiceFiscale';
    max?: number | string;
    maxLength?: number | '';
    messages?: IFormElementValidationMessages;
    min?: string | number;
    minLength?: number | '';
    required?: boolean | string | JsonLogicNode[];
    service?: any;
}

export interface IFormElementValidationMessages {
    custom?: string;
    filePatternWrong?: string;
    pattern?: string;
    max?: string;
    maxLength?: string;
    min?: string;
    minLength?: string;
    uploadRequired?: string;
    required?: string;
}

/**
 * Data
 */
export interface IFormData {
    autocompleteType?: 'server';
    codiceField?: string;
    columns?: IFormTableColumn[];
    configurableParams?: { [key: string]: string };
    filter?: IForm;
    jsonRuleService?: string;
    labelField?: string;
    mapFieldToFormKey?: { [key: string]: string };
    method?: 'GET' | 'POST';
    pagination?: {
        showFirstLastButtons?: boolean,
        sizeOptions?: number[],
        size?: number,
        startIndex?: number
    };
    params?: { [key: string]: any };
    saveProperty?: string;
    url?: string;
    values?: { [key: string]: any }[];
    valueType?: 'object' | 'string';
}

/**
 * Single element
 */
export interface IFormElement {
    /**
     * identificativo univoco del controllo all'interno del form
     */
    key?: string;

    /**
     * il tipo di controllo
     */
    type?: IFormElementType;

    /**
     * Tipi di file accettabili, come attributo 'accept' di <input type="file" />.
     */
    accept?: string;

    /**
     * Utilizzato soltanto per i pulsanti
     */
    action?: string;

    /**
     * Se false, permette di inserire un solo file nei campi di tipo upload
     */
    allowMultiValue?: true;

    /** Non utilizzato */
    alwaysEnabled?: boolean;
    /** Non utilizzato */
    attrs?: IFormElementAttributes[];
    /** Non utilizzato */
    authenticate?: boolean;
    /** Non utilizzato */
    autofocus?: boolean;

    /** Utilizzato per personalizzare il bottone */
    buttonData?: IFormButton;

    /**
     * l'url da chiamare per il servizio di business delegation esterno
     */
    bdUrl?: string;

    /**
     * Se il valore predefinito deve essere calcolato in base
     * a una formula jsonLogic allora bisogna passare qui la
     * formula jsonLogic
     */
    calculatedValue?: string;
    /**
     * Classe aggiuntiva, per il momento utilizzata solo su Columns
     */
    className?: string;
    /** Non utilizzato */
    clearOnHide?: boolean;
    /** Non utilizzato */
    collapsible?: boolean;

    /**
     * Le colonne per il tipo di layout columns
     */
    columns?: IFormColumn[];

    /**
     * Solo per ObjectList
     */
    columnsDefinition?: IFormTableColumn[];

    /**
     * Elenco di oggetti figli
     */
    components?: IFormElement[];

    /**
     * Gestisce la visibilità del controllo in base ad alcuni parametri
     */
    conditional?: IFormConditional;

    /**
     * Il contenuto di HtmlElement oppure la funzione da richiamare per un pulsante
     */
    content?: any;

    /**
     * Azione custom per i pulsanti
     */
    custom?: string;

    /**
     * Dati per popolare Autocomplete e Select statici
     */
    data?: IFormData;

    /**
     * Il tipo di sorgente di dati per select, autocomplete, chips, ecc.
     */
    dataSrc?: 'url' | 'values' | 'resource';

    /** Non utilizzato */
    dataGridLabel?: boolean;
    /** Non utilizzato */
    datePicker?: any;
    /** Non utilizzato */
    datepickerMode?: string;
    /** Non utilizzato */
    defaultDate?: any;

    /**
     * Utilizzato sulla select
     */
    defaultValue?: string | number | boolean;


    /** Non utilizzato */
    description?: string;

    /**
     * Il campo può essere disabilitato direttamente con un booleano oppure con una stringa jsonLogic
     */
    disabled?: boolean | string;
    // display?: boolean;

    /**
     * Il tipo di controllo da visualizzare (output è di sola lettura e può avere un layout differente)
     */
    displayMode?: 'input' | 'output';

    /**
     * Utilizzato da ObjectListModal è la URL del servizio da chiamare per i dati in tabella
     */
    domainUrl?: string;
    /* Nasconde prima riga del repeatable */
    emptyRepeatable?: boolean;
    /** Non utilizzato */
    enableDate?: boolean;
    /** Non utilizzato */
    enableTime?: boolean;
    // encrypted?: boolean;
    /** Non utilizzato */
    errorLabel?: string;
    /** Non utilizzato */
    format?: string;
    /**
     * Diamo la possibilità di rinominare (Upload element) la proprietà 'data' perchè in alcuni servizi BE può essere nominato diversamente
     */
    fieldName?: string;
    /** Non utilizzato */
    fieldSet?: boolean;
    /** Non utilizzato */
    filter?: string;

    /** Utilizzato nel componente di tipo file, se settato true va effettuato
     * un controllo a back-end sull'esistenza di firma digitale nel file
     */
    firmaObbligatoria?: boolean;

    /** Flag per attivare un campo nascosto con il valore completo di una combo
     * ad esempio { label: 'Foo', value: 'Bar'[, other: 'Baz', ...]}
     */
    fullValue?: boolean;

    /**
     * Le tabelle hanno anche l'header
     */
    header?: any;

    /**
     * Il campo può essere nascosto direttamente con un booleano oppure con una stringa jsonLogic
     */
    hidden?: boolean | string;

    /**
     * Utilizzato per i componenti ripetibili, serve a nascondere i pulsanti mantenendo attivi i campi all'interno
     */
    hideButtons?: boolean;

    /**
     * Se vogliamo nascondere l'etichetta di questo campo
     */
    hideLabel?: boolean;

    /**
     * Unicamente per le tabelle serve a nascondere il loro loader
     */
    hideLoader?: boolean;

    /**
     * Nasconde la checkbox "Seleziona tutto" su SelectBoxesComponent
     */
    hideSelectAll?: boolean;

    /**
     * Utilizzato su htmlElement (@todo: forse deve essere accorpato a content?)
     */
    html?: string;

    /**
     * Il nome della proprietà che contiene un ID univoco (usato da objectList)
     */
    idProperty?: string;


    /** Non utilizzato */
    inline?: boolean;

    /**
     * Se il compoente non è utilizzato all'interno di un form allora non è
     * un componente di input e alcune funzionalità devono essere disattivate
     */
    input?: boolean;
    /** Non utilizzato */
    inputMask?: string;
    /** Non utilizzato */
    inputType?: 'text' | 'tel' | 'checkbox' | 'email' | 'radio' | 'number';

    /**
     * jsonLogic è stato rimosso in favore di disabled, hidden, multiple e validate.custom
     * lo lasciamo soltanto per compatibilità legacy
     */
    jsonLogic?: { [key: string]: any[] | string };
    /** Non utilizzato */
    kickbox?: any;
    label?: any;
    /** Non utilizzato */
    labelPosition?: string;

    /**
     * Il nome della proprietà da utilizzare come label per gli Autocomplete
     */
    labelProperty?: string;


    /** Non utilizzato */
    labelWidth?: number | string;

    /** Non utilizzato */
    labelMargin?: number | string;

    /**
     * Usato come titolo per i container e i fieldset
     */
    legend?: string;

    /**
     * Usato come titolo sotto i tabs
     */
    tabsLabel?: { [key: string]: string };

    /**
     * I tab potrebbero avere una etichetta localizzata
     */
    localizedLabel?: { [key: string]: string };
    /** Non utilizzato */
    lockKey?: boolean;
    /** Non utilizzato */
    mask?: boolean;
    /**
     * Utilizzato per il left-menu
     */
    menu?: IFormMenu[];

    /**
     * Si trova su alcuni tabs per indicare che si tratta di un modulo tecnico
     */
    moduloTecnico?: boolean;
    /**
     * Il campo può essere ripetibile in base al valore booleano o alla stringa jsonLogic
     */
    multiple?: boolean | string;


    /** Non utilizzato */
    name?: string;

    /**
     * si usa nel componente objectlist per nascondere i bottoni di modifica
     */
    noButton?: boolean;

    /**
     * si usa nel componente objectlist per nascondere i bottoni di modifica
     */
    noAddButton?: boolean;

    /**
     * si usa nel componente objectlist per nascondere i bottoni di modifica
     */
    noRemoveButton?: boolean;

    /**
     * si usa nel componente objectlist per nascondere i bottoni di modifica
     */
    noRulesButton?: boolean;

    /** Non utilizzato */
    numRows?: number | string;

    /**
     * Posizione etichetta per selectBoxes
     */
    optionsLabelPosition?: string;

    /**
     * Un riferimento al contenitore (se disponibile)
     */
    parent?: IFormElement;

    /** Non utilizzato */
    persistent?: boolean;

    /**
     * Testo segnaposto
     */
    placeholder?: string;
    /** Non utilizzato */
    prefix?: string;
    /** Non utilizzato */
    properties?: any;
    /** Non utilizzato */
    protected?: boolean;

    /**
     * La table ha anche rows
     */
    rows?: IFormElement[][];

    /**
     * Indice selezionato per i Tabs
     */
    selectedIndex?: number | string;

    /**
     * Read only flag viene anche passato di padre in figlio
     */
    readOnly?: boolean;

    /** Non utilizzato */
    refreshOn?: string;
    /** Non utilizzato */
    refreshOnChange?: boolean;
    // rows?: number;
    /** Non utilizzato */
    searchField?: string;
    /** Non utilizzato */
    selectValues?: string;

    /**
     * Utilizzato da UploadComponent per il caricamento singolo o multiplo
     */
    singleUpload?: boolean;
    /** Non utilizzato */
    source?: string;
    /** Non utilizzato */
    spellcheck?: boolean;
    /** Non utilizzato */
    style?: any;

    suffix?: string;
    /** Non utilizzato */
    tab?: number | string;
    /** Non utilizzato */
    tableView?: boolean;
    // tab?: string | 0;

    /**
     * Il tag da utilizzare come contenitore di HtmlElement
     */
    tag?: string;

    /** Non utilizzato */
    tags?: string[];

    /**
     * La URL cui inviare i file in Upload
     */
    target?: string;
    /** Non utilizzato */
    template?: string;
    /** Non utilizzato */
    tree?: boolean;

    /**
     * La URL tramite la quale scaricare il singolo file caricato
     */
    downloadUrl?: string;

    /**
     * La URL di un file statico da scaricare (eventuale modell per upload)
     */
    downloadFile?: string;

    /**
     * La URL tramite la quale eliminare il singolo file caricato
     */
    deleteUrl?: string;

    /**
     * Campo per componente con spunta di obbligatorieta per ogni file
     */
    mandatory?: boolean;

    /**
     * Campo per il controllo della checkbox del componente upload
     */
    mandatoryChecked?: boolean;

    /**
     * Testo per il tooltip
     */
    tooltip?: IFormTooltip;

    /** Utilizzato solo per il campo datetime
     * Serve ad attivare ore e minuti
     */
    timePicker?: boolean;

    /** Non utilizzato */
    unique?: boolean;

    /** Il nome della proprietà che, nella risposta all'upload, conterrà l'ID del file caricato (default: objectId) */
    uploadResponseId?: string;

    /** Contiene i criteri di validazione */
    validate?: IFormElementValidation;
    /** Non utilizzato */
    value?: any;
    /** Opzioni per radio e select */
    values?: IFormOptions[];

    /** Il nome della proprietà che contiene il valore */
    valueProperty?: string;
    // widget?: any;

    wsmData?: any[];
}

export interface IFormMenu {
    mode: 'over' | 'push' | 'side';
    menu: { url: string, label: string }[];
}

export type IFormElementType =
    'actionbutton' |
    'autocomplete' |
    'button' |
    'bdButton' |
    'checkbox' |
    'chips' |
    'column' |
    'columns' |
    'container' |
    'dataSelect' |
    'dataTable' |
    'datetime' |
    'email' |
    'fieldset' |
    'file' |
    'htmlelement' |
    'htmlbox' |
    'image' |
    'jsonRule' |
    'jsonRulesList' |
    'map' |
    'mapHtml' |
    'multiLang' |
    'number' |
    'objectList' |
    'objectList2' |
    'objectListModuli' |
    'panel' |
    'parixgate' |
    'password' |
    'phoneNumber' |
    'radio' |
    'repeatable' |
    'select' |
    'selectboxes' |
    'table' |
    'tabs' |
    'textarea' |
    'textfield' |
    'well';

export type IFormButtonColor = '' | 'default' | 'none' | 'primary' | 'accent' | 'warn';

export type IFormButtonStyle = '' | 'default' | 'basic' | 'raised' | 'stroked' | 'flat' | 'icon';

