import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpEventType,
    HttpHeaders,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';
import {IFormElement} from '../../shared/models/form-element.model';
import {FormControl, NgForm} from '@angular/forms';
import {UploadConfirmComponent} from './upload-confirm/upload-confirm.component';
import {UploaderService} from '../../shared/services/uploader.service';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {MatDialog} from '@angular/material/dialog';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
    selector: 'mrf-upload-element',
    templateUrl: './upload-element.component.html',
    styleUrls: ['./upload-element.component.scss']
})
export class UploadElementComponent implements OnInit, AfterViewInit {

    /** Riferimento al form di cui questo controllo fa parte */
    @Input() formRef: NgForm;

    /** Descrittore JSON del controllo */
    @Input() field: IFormElement;
    @Input() readOnly: boolean;

    /** Riferimento al campo nascosto che viene registrato sul form */
    public hiddenControl: FormControl;

    /** Campo per il controllo di upload multiplo o singolo */
    public singleUpload = false;
    /**
     * Tipi di file accettabili, come attributo 'accept' di <input type="file" />.
     */
    public accept: string;

    /** Elenco dei file */
    public files: Array<FileUploadModel> = [];

    /** Nome del parametro utilizzato nella richiesta HTTP */
    private param = 'data';

    /** URL per richiamare il servizio per il download dei file */
    private downloadUrl: string;

    /** URL per richiamare il servizio per la rimozione di un file */
    private deleteUrl: string;

    /** Il campo HTMLFileInputElement che viene usato per aprire il file picker */
    @ViewChild('fileUpload') private fileUploadComponent: ElementRef;

    public fileUploadInput: HTMLInputElement;

    /**
     * Il form che contiene l'intput type file,
     * perché mandare il reset a questo form
     * è l'unico modo per svuotare il campo
     */
    @ViewChild('fakeForm') private fakeFormComponent: ElementRef;
    private fakeForm: HTMLFormElement;
    private isUploadSuccessful = false;
    private fileToDelete: FileUploadModel;

    /**
     * Conserviamo il precedente valore booleano di visibilità
     * per conoscere il momento in cui cambia
     */
    private componentWasVisible: boolean;

    constructor(
        private http: HttpClient,
        private dialog: MatDialog,
        private uploaderService: UploaderService,
        private utility: UtilityService,
        private valueService: ValueService
    ) {
    }

    ngOnInit() {
        /**
         * Imposto il suffisso se non definito
         */
        this.field.suffix = this.field.suffix || '';
        /**
         * Imposto un valore per il campo disabled se non esiste
         */
        this.field.disabled = this.field.disabled || false;
        /**
         * Imposto l'url di download
         */
        this.downloadUrl = this.field.downloadUrl;
        /**
         * Imposto il campo accept se non definito
         */
        this.accept = this.field.accept || '*/*';
        /**
         * Imposto la variabile singleUpload che
         * se impostata a true consente il caricamento
         * di un solo componente
         */
        this.singleUpload = true;
        if (this.field.singleUpload === false || !!this.field.allowMultiValue) {
            this.singleUpload = false;
        }
        /**
         * Registro lo mia presenza sul servizio
         * degli upload per gestire l'invio
         * dei file solo alla submit dell'intero form
         */
        this.uploaderService.registerControl(this);
        this.deleteUrl = this.field.deleteUrl;

        this.param = this.field.fieldName || 'data';

    }

    ngAfterViewInit(): void {
        /**
         * Recupero un riferimento all'AbstractControl dell'input hidden
         */
        this.hiddenControl = this.formRef.controls[this.field.key + this.field.suffix] as FormControl;

        /**
         * Quando varia il valore del campo nascosto devo aggiornare l'elenco dei file
         */
        this.hiddenControl.valueChanges.subscribe(v => {
            if (Array.isArray(v)) {
                for (const fileItem of v) {
                    let shouldAdd = true;

                    for (const knownItem of this.files) {
                        if (fileItem.data.name === knownItem.data.name) {
                            shouldAdd = false;
                            break;
                        }
                    }
                    if (shouldAdd) {
                        const fileToPush = (fileItem as FileUploadModel);
                        fileToPush.state = 'out';
                        fileToPush.inProgress = false;
                        fileToPush.progress = 100;
                        fileToPush.canRetry = false;
                        fileToPush.canCancel = true;
                        fileToPush.canDownload = true;
                        fileToPush.canCheck = false;
                        fileToPush.mandatoryChecked = fileItem.mandatory;
                        this.files.push(fileToPush);
                        this.hiddenControl.updateValueAndValidity({onlySelf: true, emitEvent: false});
                    }
                }
            } else {
                this.files = [];
                this.hiddenControl.updateValueAndValidity({onlySelf: true, emitEvent: false});
            }
        });
        /**
         * Valorizzo il riferimento al campo HTMLFileInputElement
         */
        this.fileUploadInput = this.fileUploadComponent.nativeElement as HTMLInputElement;
        this.fakeForm = this.fakeFormComponent.nativeElement as HTMLFormElement;
        this.fileUploadInput.onchange = () => {
            /**
             * Quando seleziono un file
             */
            this.hiddenControl.markAsTouched();
            /**
             * singleUpload significa che posso caricare un solo file
             */
            if (!!this.singleUpload) {
                for (const file of this.files) {
                    this.cancelFile(file, 'change');
                }
                this.files = [];
            }
            /**
             * FilesList non sempre è iterabile, va convertito in Array
             */
            for (const file of Array.from(this.fileUploadInput.files)) {
                this.files.push({
                    data: file,
                    state: 'in',
                    inProgress: false,
                    progress: 0,
                    canRetry: false,
                    canCancel: true,
                    canDownload: false,
                    canCheck: !this.field.mandatoryChecked,
                    mandatoryChecked: this.field.mandatoryChecked
                });
            }
            /**
             * Salvo il valore nel campo hidden
             */
            this.updateValue();
            /**
             * Svuoto l'input type file perché altrimenti non viene
             * scatenato l'evento change quando carico un nuovo file
             * con lo stesso nome
             */
            this.fakeForm.reset();
        };
    }

    /**
     * Elmina un file dall'elenco, se il file è stato
     * già caricato allora chiama il servizio per cancellarlo
     *
     * @param file Il file da cancellare
     * @param type se sto cancellando o sostituendo
     * @param showConfirmDialog se mostrare o meno la finestra di conferma
     */
    cancelFile(file: FileUploadModel, type?: string, showConfirmDialog: boolean = true) {
        this.fileToDelete = Object.assign({}, file);

        if (showConfirmDialog) {
            const confirmDialog = this.dialog.open(UploadConfirmComponent, {
                width: '50%',
                data: {file, type},
                maxWidth: '600px'
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (!!result) {
                    this.doCancelFile(result);
                } else {
                    this.files = [];
                    this.files.push(this.fileToDelete);
                    this.updateValue();
                }
            });
        }
    }

    /**
     * Viene richiamata per cancellare effettivamente il file
     * Si arriva qui dopo la conferma sulla dialog oppure direttamente se la dialog è disabilitata
     */
    private doCancelFile(data: { file: FileUploadModel, type: string }) {
        /**
         * @TODO: questo component deve lavorare anche se non c'è un ID
         * Al momento in assenza di ID non si è in grado di cancellare il file caricato!
         */
        if (!!data.file && !!data.file.sub) {
            data.file.sub.unsubscribe();
        }
        let id;
        // Se il file è salvato su MongoDB il suo id si trova nel campo objectId
        // Altrimenti se il file è salvato su Oracle, l'id coincide con response.
        if (!!data.file.response) {
            id = data.file.response;
            if (!!data.file.response.objectId) {
                id = data.file.response.objectId;
            }
        }
        /**
         * se l'id non c'è significa che il file è stato aggiunto ma non ancora caricato nel db, quindi non devo eliminarlo
         */
        if (!!this.deleteUrl && !!id) {
            this.http.delete(this.deleteUrl + id).subscribe(() => {
                this.removeFileFromArray(data.file);
                this.uploaderService.uploadDeleted();
            });
            if (this.files.length > 0) {
                this.removeFileFromArray(data.file);
            }
        } else {
            this.removeFileFromArray(data.file);
        }
    }


    public downloadFile(file) {
        const downloadUrlFromService = this.uploaderService.getDownload(this.field.key + this.field.suffix);

        let downloadUrl;

        // Se il file è salvato su MongoDB il suo id si trova nel campo objectId
        // Altrimenti se il file è salvato su Oracle, l'id coincide con response.
        if (!!downloadUrlFromService) {
            downloadUrl = downloadUrlFromService;
        } else if (!!file.response && !!file.response.objectId) {
            downloadUrl = this.downloadUrl + file.response.objectId;
        } else if (!!file.response) {
            downloadUrl = this.downloadUrl + file.response;
        } else if (typeof file === 'string') {
            downloadUrl = file;
        }
        return this.http.get(downloadUrl, {observe: 'response', responseType: 'blob'})
            .pipe(
                map((res: HttpResponse<Blob>) => {
                    console.log(res);
                    return {
                        filename: this.getFilename(res.headers) || this.getFilenameFromUrl(res.url),
                        data: res.body
                    };
                })
            ).subscribe(resp => {
                const downloadURL = URL.createObjectURL(resp.data);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = downloadURL;
                a.download = resp.filename;
                a.click();
                window.URL.revokeObjectURL(downloadURL);
                a.remove();
            });
    }

    getFilename(headers: HttpHeaders) {
        const contentDispHeader = headers.get('content-disposition');
        if (!contentDispHeader) {
            return null;
        }
        return contentDispHeader.replace('attachment; filename=', '');
    }

    getFilenameFromUrl(url: string): string {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    public uploadFiles() {
        this.fileUploadInput.value = '';

        this.files.forEach(file => {
            if (
                !file.inProgress
                &&
                (file.progress === 0 || file.canRetry)
                &&
                file.progress !== 100
            ) {
                this.uploadFile(file);
            } else if (!file.inProgress && file.progress === 100) {
                file.canDownload = true;
            }
        });
    }

    private updateValue() {
        this
            .hiddenControl
            .setValue(
                this
                    .files
                    .map(
                        (item: FileUploadModel) => {
                            const obj = {
                                canCancel: item.canCancel,
                                canCheck: item.canCheck,
                                canDownload: item.canDownload,
                                canRetry: item.canRetry,
                                data: !!item.data ? {
                                    lastModified: item.data.lastModified,
                                    name: item.data.name,
                                    size: item.data.size,
                                    type: item.data.type,
                                } : {},
                                blob: null,
                                response: item.response,
                                inProgress: item.inProgress,
                                mandatoryChecked: item.mandatoryChecked,
                                progress: item.progress,
                                state: item.state
                            };

                            /**
                             * Carica il blob del file e lo inserisce all'interno dell'oggetto
                             */
                            const fileReader: FileReader = new FileReader();
                            fileReader.onloadend = (x) => {
                                obj.blob = fileReader.result;
                            }
                            switch (this.field.source) {
                                case 'buffer':
                                    fileReader.readAsArrayBuffer(item.data);
                                    break;
                                case 'binary':
                                    fileReader.readAsBinaryString(item.data);
                                    break;
                                case 'dataUrl':
                                    fileReader.readAsDataURL(item.data);
                                    break;
                                default:
                                    fileReader.readAsText(item.data);
                            }
                            return obj;
                        }
                    )
            );
    }

    private uploadFile(file: FileUploadModel) {
        const fd = new FormData();
        fd.append(this.param, file.data);

        const fieldKey = this.field.key + this.field.suffix;

        const uploadAdditionalData = this.uploaderService.getAdditionalData(fieldKey);
        for (const k in uploadAdditionalData) {
            if (uploadAdditionalData.hasOwnProperty(k)) {
                fd.append(k, uploadAdditionalData[k]);
            }
        }

        const uploadUrl = this.uploaderService.getTarget(fieldKey) || this.field.target;

        const req = new HttpRequest('POST', uploadUrl, fd, {
            reportProgress: true
        });

        file.inProgress = true;
        file.canCheck = false;
        file.sub = this.http.request(req).pipe(
            map(event => {
                this.updateValue();
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        file.progress = Math.round(event.loaded * 100 / event.total);
                        if (!this.isUploadSuccessful) {
                            file.progress = file.progress - 1;
                        }
                        break;
                    case HttpEventType.ResponseHeader:
                        this.isUploadSuccessful = event.ok;
                        if (this.isUploadSuccessful) {
                            file.progress = 100;
                        }
                        break;
                    case HttpEventType.Response:
                        return event;
                }
            }),
            tap(message => {
            }),
            last(),
            catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                file.canRetry = true;
                file.canDownload = false;
                file.canCheck = false;
                file.progress = 0;
                this.updateValue();
                this.uploaderService.uploadFailed(file.response);
                return of(`${file.data.name} upload failed.`);
            })
        ).subscribe(
            (event: any) => {
                if (typeof (event) === 'object') {
                    file.response = event.body;
                    this.updateValue();
                    /// @TODO: Sarebbe comodo aggiungere l'id del campo
                    this.uploaderService.uploadCompleted(file.response);
                }
                file.canDownload = true;
                file.canCheck = false;
            }
        );
    }

    private removeFileFromArray(file: FileUploadModel) {
        const index = this.files.indexOf(file);
        if (index > -1) {
            this.files.splice(index, 1);
        }
        this.updateValue();
    }


    /**
     * Se l'elemento è nascosto deve perdere il valore
     */
    ngAfterContentChecked() {
        /// Se il componente è appena comparso ricarica il valore dal form
        const componentIsVisible = this.valueService.isVisible(this.field);
        const componentId = this.field.key + this.field.suffix;
        if (componentIsVisible) {
            if (!this.componentWasVisible) {
                /// Componente appena comparso
            }
        } else {
            if (this.componentWasVisible) {
                /// Componente appena nascosto
                const componentCount = this.valueService.visibleCount;
                if (!componentCount[componentId]) {
                    /// Non ci sono altri controlli con lo stesso nome
                    if (this.formRef.controls.hasOwnProperty(componentId)) {
                        this.formRef.controls[componentId].setValue(null, {
                            onlySelf: true,
                            emitEvent: false
                        });
                    }
                }
            }
        }
        this.componentWasVisible = !!componentIsVisible;
    }
}

export class FileUploadModel {
    data: File;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    canDownload: boolean;
    canCheck: boolean;
    sub?: Subscription;
    response?: any;
    mandatoryChecked?: boolean;
}
