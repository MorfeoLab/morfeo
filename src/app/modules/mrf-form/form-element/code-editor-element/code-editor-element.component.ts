import {Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import * as beautify from 'js-beautify';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';

@Component({
    selector: 'mrf-code-editor-element',
    templateUrl: './code-editor-element.component.html',
    styleUrls: ['./code-editor-element.component.scss'],
})
export class CodeEditorElementComponent {
    @Input() field: IFormElement;
    @Input() formRef: NgForm;
    @Input() readOnly: boolean;
    @ViewChild('codeEditorDummyBorder') public codeEditorDummyBorderRef: ElementRef;
    @ViewChild('codeMirrorContainer') public codeMirrorContainerRef: ElementRef;


    public dummyMe: any;

    /**
     *  Linguaggi/formatti gestiti dall'editor (es. csv, json, xml...)
     *
     */
    public inputType: string;

    /**
     *  Stringa contenenete la label
     *
     */
    public displayLabel: string;

    /**
     *  Stringa contenente la leggenda
     *
     */
    public displayLegend: string;

    /**
     *  Opzioni di configurazione dell'editor tramite la proprietà codeEditorOptions
     *
     */
    public codeMirrorOptions: any;

    /**
     * Stringa contenente il testo inserito dall'utente
     *
     */
    public content: any;

    /**
     *  Classi necessarie per simulare la floating-label nel ngx-codemirror element
     *
     */
    public matFormClasses: string[];

    /**
     *  Contenuto dummy per l'elemento input dummy
     *
     */
    public dummyContent: any;

    public dummyFormRef: NgForm;

    /**
     * Classi necessarie per simulare la floating-label nel ngx-codemirror element
     *
     */
    public inputClasses: string[];

    /**
     *  Classi del codemirror element
     *
     */
    public codeMirrorContainerClass: string[];

    public showLabel: boolean;

    /**
     * Classi usate per emulare l'effetto focusOut di Material
     *
     */
    public materialNoFocusClasses: string[];

    /**
     * Classi usate per emulare l'effetto focusIn di Material
     *
     */
    public materialFocusClasses: string[];

    public dummyBorder: string[];

    public readOnlyClasses: string[];

    constructor(
        private renderer: Renderer2,
        private translatable: TranslatablePipe
    ) {

        this.materialNoFocusClasses = [
            'mat-form-field',
            'ng-tns-c80-1',
            'mat-primary',
            'mat-form-field-type-mat-input',
            'mat-form-field-appearance-legacy',
            'mat-form-field-can-float',
            'mat-form-field-hide-placeholder'
        ];

        this.materialFocusClasses = [
            ...this.materialNoFocusClasses,
            'mat-focused'
        ];

        this.readOnlyClasses = [
            'mat-form-field',
            'field',
            'full-width',
            'ng-tns-c80-2',
            'mat-primary',
            'mat-form-field-type-mat-input',
            'mat-form-field-appearance-legacy',
            'mat-form-field-can-float',
            'mat-form-field-hide-placeholder',
            'ng-untouched',
            'ng-pristine',
            'mat-form-field-has-label',
            'ng-star-inserted',
            'mat-form-field-disabled',
            'mat-form-field-should-float'
        ];
        if (!this.field) {
            return;
        }
    }

    public ngOnInit(): void {
        this.matFormClasses = ['full-width'];
        this.inputClasses = ['code-editor-input'];
        if (this.field.codeEditorOptions.indentDefaultValue === undefined || !!this.field.codeEditorOptions.indentDefaultValue) {
            this.content = this.indent(String(this.field.defaultValue));
        } else {
            this.content = this.field.defaultValue;
        }
        if (!!this.content) {
            this.showLabel = true;
            this.matFormClasses = this.matFormClasses.concat(['mat-form-field-should-float']);
            this.inputClasses = this.inputClasses.concat(['code-editor-input-hide']);
        } else {
            this.showLabel = false;
        }
        if (!!this.field.hideLabel) {
            this.displayLabel = '';
            this.displayLegend = null;
        } else {
            this.displayLabel = this.translatable.transform(this.field.label);
            this.displayLegend = this.translatable.transform(this.field.legend);
        }
        this.codeMirrorOptions = {
            lineNumbers: !!this.field.codeEditorOptions.showLineNumbers || false,
            lineWrapping: true,
            mode: this.configureMode(),
            readOnly: this.field.readOnly,
        }
    }

    /**
     * Elimina le parti non necessarie dell'elemento mat-form-field usato per emulare
     * gli efetti focusIn e focusOut di material
     *
     */
    public ngAfterViewInit(): void {
        if (this.codeEditorDummyBorderRef.nativeElement && this.codeEditorDummyBorderRef.nativeElement.parentNode) {
            const div = this.codeEditorDummyBorderRef.nativeElement.parentNode;
            this.renderer.setStyle(div, 'display', 'none');
            this.renderer.setStyle(div.parentNode.parentNode, 'height', '0');
        }
        if (this.field.readOnly) {
            this.dummyBorder = this.readOnlyClasses;
            const textDiv = this.codeMirrorContainerRef.nativeElement.childNodes[0].childNodes[1];
            this.renderer.setStyle(textDiv, 'color', '#ACA6B7');
        }
    }

    /**
     *  Applica l'indentazione della stringa ricevuta come defaultValue
     *
     */
    private indent(defaultValue: string): string {
        const size = this.field.codeEditorOptions.indentSize;
        const params = [defaultValue, {indent_size: !!size ? size : 2}];
        switch (this.field.codeEditorOptions.mode) {
            case 'csv':
                return beautify.css_beautify(params[0], params[1]);
            case 'html':
            case 'xml':
                return beautify.html_beautify(params[0], params[1]);
            case 'json':
            case 'javascript':
                return beautify.js_beautify(params[0], params[1]);
        }
    }

    /**
     *  Mapping del mode 'json' a 'javascript' necessario per il component ngx-codemirror
     *
     */
    private configureMode(): any {
        if (this.field.codeEditorOptions.mode === 'json') {
            return {name: 'javascript', json: true};
        }
        return this.field.codeEditorOptions.mode;
    }

    /**
     *  Classi necessarie per simulare gli effetti visivi di material input sull'
     *  elemento di tipo ngx-codemirror
     *
     */
    public onCodeEditorClick(): void {
        if (this.field.readOnly) return;
        this.showLabel = true;
        this.matFormClasses = ['full-width', 'mat-focused', 'mat-form-field-should-float'];
        this.inputClasses = ['code-editor-input-hide'];
        this.codeMirrorContainerClass = ['code-mirror-container-relative'];
        this.dummyBorder = this.materialFocusClasses;
    }

    /**
     *  Classi necessarie per simulare gli effetti visivi di material input sull'
     *  elemento di tipo ngx-codemirror
     *
     */
    public onFocusOut(): void {
        if (this.field.readOnly) return;
        if (!!this.content) {
            this.showLabel = true;
            this.matFormClasses = ['full-width', 'mat-form-field-should-float'];
            this.inputClasses = ['code-editor-input-hide'];
            this.codeMirrorContainerClass = ['code-mirror-container-relative'];
        } else {
            this.showLabel = false;
            this.matFormClasses = ['full-width'];
            this.inputClasses = ['code-editor-input-show'];
            this.codeMirrorContainerClass = ['code-mirror-container-absolute'];
        }
        this.dummyBorder = this.materialNoFocusClasses;
    }

    /**
     *  Classi necessarie per simulare la floating label di material sull'
     *  elemento di tipo ngx-codemirror
     *
     */
    public ngAfterContentChecked(): void {
        if (!!this.content) {
            this.inputClasses = ['code-editor-input-hide'];
            this.codeMirrorContainerClass = ['code-mirror-container-relative'];
        }
    }
}
