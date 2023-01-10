import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm} from '../shared/models/form-element.model';
import {MrfFormComponent} from '../mrf-form.component';
import {HttpClient} from '@angular/common/http';
import {FORM_T} from "./test-form.models";

@Component({
    selector: 'mrf-test-component',
    templateUrl: './test-component.component.html',
    styleUrls: ['./test-component.component.scss']
})
// Component used to test and develop the library
export class TestComponentComponent {

    public mainFormRef: NgForm;
    private mainFormContainer: MrfFormComponent;

    @ViewChild('mainForm') set mainFormContent(content: MrfFormComponent) {
        if (content) {
            this.mainFormContainer = content;
            this.mainFormContainer.formReadyEvent.subscribe((form) => {
                this.mainFormRef = form;
            });
        }
    }

    public mainFormJson: IForm;

    public externalData = {};

    constructor(
        private http: HttpClient
    ) {
    }


    public caricaForm1() {
        this.mainFormJson = FORM_T;
    }

    public caricaForm2() {

        this.mainFormJson = {
            avoidLowerCase: true,
            components: [
                {
                    key: '$TIPOLOGIA_ENTE',
                    type: 'textfield',
                    label: 'Attributo tipologia ente',
                    hidden: 'true',
                    defaultValue: 'Comune',
                    disabled: false,
                    readOnly: false,
                    validate: {
                        required: null,
                        custom: null,
                        maxLength: null,
                        messages: null
                    },
                    calculatedValue: null,
                    placeholder: null
                },
                {
                    key: 'PROVINCIA_ENTE',
                    type: 'textfield',
                    label: 'Attributo provincia ente',
                    defaultValue: 'RO',
                    disabled: false,
                    readOnly: false,
                    validate: {
                        required: null,
                        custom: null,
                        maxLength: null,
                        messages: null
                    },
                    calculatedValue: null,
                    placeholder: null
                },
                {
                    key: 'Soggettodichiarantetipo1',
                    type: 'select',
                    label: 'Soggetto dichiarante tipo',
                    hidden: null,
                    defaultValue: '',
                    disabled: false,
                    readOnly: false,
                    validate: {
                        required: 'true',
                        custom: '[]',
                        maxLength: null,
                        messages: {
                            custom: ''
                        }
                    },
                    calculatedValue: null,
                    data: {
                        values: [
                            {
                                label: '',
                                value: ''
                            },
                            {
                                label: 'Azienda Sanitaria',
                                value: 'azienda sanitaria'
                            },
                            {
                                label: 'Comune',
                                value: 'comune'
                            },
                            {
                                label: 'Consorzio di Bonifica',
                                value: 'consorzio di bonifica'
                            },
                            {
                                label: 'Ente Gestore Energia',
                                value: 'ente gestore energia'
                            },
                            {
                                label: 'Ente Gestore Infrastruttura Ferroviaria',
                                value: 'ente gestore infrastruttura ferroviaria'
                            },
                            {
                                label: 'Ente Gestore Telefonia',
                                value: 'ente gestore telefonia'
                            },
                            {
                                label: 'Ente Gestore Viabilità',
                                value: 'ente gestore viabilità'
                            },
                            {
                                label: 'Ente Parco',
                                value: 'ente parco'
                            },
                            {
                                label: 'Ente Prevenzione Ambientale',
                                value: 'ente prevenzione ambientale'
                            },
                            {
                                label: 'Prefettura UTG',
                                value: 'prefettura utg'
                            },
                            {
                                label: 'Provincia',
                                value: 'provincia'
                            },
                            {
                                label: 'Regione Del Veneto',
                                value: 'regione del veneto'
                            },
                            {
                                label: 'Società Autostradale',
                                value: 'società autostradale'
                            },
                            {
                                label: 'Società Multiservizi',
                                value: 'società multiservizi'
                            },
                            {
                                label: 'Unione di Enti',
                                value: 'unione di enti'
                            },
                            {
                                label: 'VV.F.',
                                value: 'vv.f.'
                            }
                        ]
                    }
                },
                {
                    key: 'PR1',
                    type: 'select',
                    label: 'Provincia',
                    hidden: null,
                    defaultValue: '',
                    disabled: false,
                    readOnly: false,
                    dataSrc: 'values',
                    validate: {
                        required: 'true',
                        custom: '[]',
                        maxLength: null,
                        messages: {
                            custom: ''
                        }
                    },
                    calculatedValue: '[{"var":"PROVINCIA_ENTE"}]',
                    data: {
                        values: [
                            {
                                label: '',
                                value: ''
                            },
                            {
                                label: 'Belluno',
                                value: 'BL'
                            },
                            {
                                label: 'Padova',
                                value: 'PD'
                            },
                            {
                                label: 'Rovigo',
                                value: 'RO'
                            },
                            {
                                label: 'Treviso',
                                value: 'TV'
                            },
                            {
                                label: 'Venezia',
                                value: 'VE'
                            },
                            {
                                label: 'Verona',
                                value: 'VR'
                            },
                            {
                                label: 'Vicenza',
                                value: 'VI'
                            }
                        ]
                    }
                }
            ]
        };
    }

    public caricaForm3() {
        this.mainFormRef.controls.example5.setValue([
                'OTTO',
                'NOVE'
            ]
        );
        this.mainFormRef.controls.example4.setValue([
                1,
                3,
                5,
                7
            ]
        );
    }
}
