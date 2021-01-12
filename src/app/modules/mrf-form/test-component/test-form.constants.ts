import {IForm} from '../shared/models/form-element.model';

export const TEST_FORM: IForm = {
    components: [
        {
            key: 'tabs',
            type: 'tabs',
            components: [
                {
                    key: 'datiAnagrafici',
                    label: 'Domanda',
                    components: [
                        {
                            key: 'anagraficaBlock',
                            type: 'fieldset',
                            legend: 'Dati anagrafici',
                            components: [
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'cognome',
                                                    label: 'Cognome',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'nome',
                                                    label: 'Nome',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'codiceFiscale',
                                                    label: 'Codice Fiscale',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'cittadinanza',
                                                    label: 'Cittadinanza',
                                                    type: 'select',
                                                    validate: {
                                                        required: true
                                                    },
                                                    data: {
                                                        values: [
                                                            {
                                                                value: 'ITA',
                                                                label: 'Italiana'
                                                            },
                                                            {
                                                                value: 'UE',
                                                                label: 'Straniera (UE)'
                                                            },
                                                            {
                                                                value: 'EXUE',
                                                                label: 'Straniera (extra UE)'
                                                            }
                                                        ]
                                                    },
                                                    dataSrc: 'values',
                                                    valueProperty: 'value',
                                                    labelProperty: 'label'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'comuneNascita',
                                                    label: 'Comune di nascita',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'provinciaNascita',
                                                    label: 'Provincia di nascita',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'statoNascita',
                                                    label: 'Stato di nascita',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'dataNascita',
                                                    label: 'Data di nascita',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'indirizzoResidenza',
                                                    label: 'Indirizzo residenza',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'capResidenza',
                                                    label: 'C.A.P. residenza',
                                                    type: 'number',
                                                    validate: {
                                                        required: true,
                                                        maxLength: 5,
                                                        custom: ''
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'comuneResidenza',
                                                    label: 'Comune di residenza',
                                                    type: 'autocomplete',
                                                    validate: {
                                                        required: true
                                                    },
                                                    input: true,
                                                    data: {
                                                        url: 'rvcp-comuni',
                                                        values: [],
                                                        autocompleteType: 'server',
                                                        method: 'GET',
                                                        mapFieldToFormKey: {
                                                            provincia: 'provinciaResidenza'
                                                        },
                                                        params: {
                                                            codice: ''
                                                        }
                                                    },
                                                    dataSrc: 'url',
                                                    valueProperty: 'id',
                                                    labelProperty: 'nome'
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'provinciaResidenza',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    label: 'Provincia residenza',
                                                    valueProperty: 'value',
                                                    labelProperty: 'label',
                                                    readOnly: true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            width: '3',
                                            components: [
                                                {
                                                    key: 'telefono',
                                                    label: 'Telefono',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: false,
                                                        maxLength: 16,
                                                        custom: '[{"!!":[{"regex":["^[0-9 ]*$",{"var":"telefono"}]}]}]'
                                                    },
                                                    readOnly: false
                                                }
                                            ]
                                        },
                                        {
                                            width: '3',
                                            components: [
                                                {
                                                    key: 'cellulare',
                                                    label: 'Cellulare',
                                                    type: 'number',
                                                    validate: {
                                                        required: false
                                                    },
                                                    readOnly: false
                                                }
                                            ]
                                        },
                                        {
                                            width: '6',
                                            components: [
                                                {
                                                    key: 'pec',
                                                    label: 'Pec',
                                                    type: 'email',
                                                    validate: {
                                                        required: false,
                                                        custom: '[{"!!":[{"regex":["^$|^[^\\n\\r ]+@[^\\n\\r ]+$", {"var":"pec"}]}]}]'
                                                    },
                                                    readOnly: false
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'email',
                                                    label: 'Email',
                                                    type: 'email',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: false
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'etichettaEmail',
                                                    type: 'htmlelement',
                                                    html: '<br/>tutte le informazioni saranno ricevute all\'indirizzo email indicato.'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            key: 'domandaBlock',
                            type: 'fieldset',
                            legend: 'Dati domanda',
                            components: [
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'sedeTerritorialeIntestazione',
                                                    label: 'Sede Territoriale Intestazione',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'ambitoIntestazione',
                                                    label: 'Ambito Intestazione',
                                                    type: 'select',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true,
                                                    data: {
                                                        values: [
                                                            {
                                                                value: '1',
                                                                label: 'Ambito Prealpino e Alpino'
                                                            },
                                                            {
                                                                value: '2',
                                                                label: 'Ambito litoraneo'
                                                            }
                                                        ]
                                                    },
                                                    dataSrc: 'values',
                                                    valueProperty: 'value',
                                                    labelProperty: 'label',
                                                    input: true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'pecAmbito',
                                                    label: 'PEC Ambito',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    },
                                                    readOnly: true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'detenzioneAreaSicurezza',
                                                    label: 'Detenzione area riferimento',
                                                    type: 'select',
                                                    validate: {
                                                        required: true
                                                    },
                                                    data: {
                                                        values: [
                                                            {
                                                                value: '1',
                                                                label: 'Appartiene al demanio ma è stata affidata con l’atto di cui si allega copia'
                                                            },
                                                            {
                                                                value: '2',
                                                                label: 'È di proprietà dell\'impresa'
                                                            },
                                                            {
                                                                value: '3',
                                                                label: 'Appartiene a (compilare)'
                                                            }
                                                        ]
                                                    },
                                                    dataSrc: 'values',
                                                    valueProperty: 'value',
                                                    labelProperty: 'label'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'tipologiaRichiesta',
                                                    label: 'Tipologia richiesta',
                                                    type: 'select',
                                                    validate: {
                                                        required: true
                                                    },
                                                    data: {
                                                        values: [
                                                            {
                                                                value: '1',
                                                                label: 'Acquacoltura in aree di proprietà privata'
                                                            },
                                                            {
                                                                value: '2',
                                                                label: 'Acquacoltura in risaia o in terreni temporaneamente allagati'
                                                            },
                                                            {
                                                                value: '3',
                                                                label: 'Acquacoltura in aree demaniali'
                                                            }
                                                        ]
                                                    },
                                                    dataSrc: 'values',
                                                    valueProperty: 'value',
                                                    labelProperty: 'label'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'fieldset',
                            label: 'Proprietario area riferimento (solo se detenzioneAreaSicurezza è "Appartiene a...")',
                            hidden: '[{"!=":[{"var":"detenzioneAreaSicurezza"},"3"]}]',
                            components: [
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'cognomeProprietarioArea',
                                                    label: 'Cognome (solo se detenzioneAreaSicurezza è "Appartiene a...")',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: '[{"==":[{"var":"detenzioneAreaSicurezza"},"3"]}]'
                                                    }
                                                },
                                                {
                                                    key: 'nomeProprietarioArea',
                                                    label: 'Nome (solo se detenzioneAreaSicurezza è "Appartiene a...")',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: '[{"==":[{"var":"detenzioneAreaSicurezza"},"3"]}]'
                                                    }
                                                },
                                                {
                                                    key: 'codiceFiscaleProprietarioArea',
                                                    label: 'Codice Fiscale (solo se detenzioneAreaSicurezza è "Appartiene a...")',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: '[{"==":[{"var":"detenzioneAreaSicurezza"},"3"]}]'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                            ]
                        },
                        {
                            key: 'acquacolturaInProprietaPrivata',
                            type: 'fieldset',
                            legend: 'Area di proprietà privata (solo se "Acquacoltura in aree di proprietà privata")',
                            hidden: '[{"!=":[{"var":"tipologiaRichiesta"},"1"]}]',
                            components: [
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'comuneImpianto',
                                                    label: 'Comune ubicazione impianto (solo se "Acquacoltura in aree di proprietà privata")',
                                                    type: 'autocomplete',
                                                    validate: {
                                                        required: '[{"==":[{"var":"tipologiaRichiesta"},"1"]}]',
                                                    },
                                                    data: {
                                                        url: 'rvcp-comuni',
                                                        values: [],
                                                        autocompleteType: 'server',
                                                        method: 'GET',
                                                        mapFieldToFormKey: {
                                                            provincia: 'provinciaResidenza'
                                                        },
                                                        params: {
                                                            codice: ''
                                                        }
                                                    },
                                                    dataSrc: 'url',
                                                    valueProperty: 'id',
                                                    labelProperty: 'nome'
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'indirizzoImpianto',
                                                    label: 'Indirizzo impianto',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'acquePubbliche',
                                                    label: 'Acque pubbliche',
                                                    type: 'select',
                                                    validate: {
                                                        required: true
                                                    },
                                                    data: {
                                                        values: [
                                                            {
                                                                value: '1',
                                                                label: 'Attinge da acque pubbliche (compilare)'
                                                            },
                                                            {
                                                                value: '2',
                                                                label: 'Non attinge da acque pubbliche'
                                                            }
                                                        ]
                                                    },
                                                    dataSrc: 'values',
                                                    valueProperty: 'value',
                                                    labelProperty: 'label'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            key: 'rilascioAutorizzazioneScaricoAcqueReflue',
                                            label: 'Rilascio autorizzazione scarico acque reflue',
                                            type: 'textfield',
                                            validate: {
                                                required: true
                                            }
                                        },
                                        {
                                            key: 'dataAutorizzazioneScaricoAcqueReflue',
                                            label: 'Data autorizzazione scarico acque reflue',
                                            type: 'datetime',
                                            validate: {
                                                required: true
                                            }
                                        },
                                        {
                                            key: 'numeroAutorizzazioneScaricoAcqueReflue',
                                            label: 'Numero autorizzazione scarico acque reflue',
                                            type: 'textfield',
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    type: 'checkbox',
                                                    key: 'conformitaNormativa',
                                                    label: 'La conformità alla normativa vigente delle opere e delle infrastrutture utilizzate per lo svolgimento dell’attività di acquacoltura'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            key: 'acquacolturaInRisaia',
                            type: 'fieldset',
                            legend: 'Risaia o terreno',
                            hidden: '[{"!=":[{"var":"tipologiaRichiesta"},"2"]}]',
                            components: [
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'comuneImpianto',
                                                    label: 'Comune ubicazione impianto',
                                                    type: 'autocomplete',
                                                    validate: {
                                                        required: '[{"==":[{"var":"tipologiaRichiesta"},"1"]}]',
                                                    },
                                                    data: {
                                                        url: 'rvcp-comuni',
                                                        values: [],
                                                        autocompleteType: 'server',
                                                        method: 'GET',
                                                        mapFieldToFormKey: {
                                                            provincia: 'provinciaResidenza'
                                                        },
                                                        params: {
                                                            codice: ''
                                                        }
                                                    },
                                                    dataSrc: 'url',
                                                    valueProperty: 'id',
                                                    labelProperty: 'nome'
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'indirizzoImpianto',
                                                    label: 'Indirizzo impianto',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: true
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'caratteristicheImpianto',
                                                    label: 'Caratteristiche impianto',
                                                    type: 'textarea'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            key: 'rilascioAutorizzazioneScaricoAcqueReflue',
                                            label: 'Rilascio autorizzazione scarico acque reflue',
                                            type: 'textfield',
                                            validate: {
                                                required: true
                                            }
                                        },
                                        {
                                            key: 'dataAutorizzazioneScaricoAcqueReflue',
                                            label: 'Data autorizzazione scarico acque reflue',
                                            type: 'datetime',
                                            validate: {
                                                required: true
                                            }
                                        },
                                        {
                                            key: 'numeroAutorizzazioneScaricoAcqueReflue',
                                            label: 'Numero autorizzazione scarico acque reflue',
                                            type: 'textfield',
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'columns',
                                    key: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    type: 'checkbox',
                                                    key: 'conformitaNormativa',
                                                    label: 'La conformità alla normativa vigente delle opere e delle infrastrutture utilizzate per lo svolgimento dell’attività di acquacoltura'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'fieldset',
                            key: 'acquePubblicheBox',
                            legend: 'Concessione acque pubbliche',
                            hidden: '[{"!=":[{"var":"acquePubbliche"},"1"]}]',
                            components: [
                                {
                                    type: 'textfield',
                                    label: 'Estremi del corso d\'acqua',
                                    key: 'estremiCorsoAcqua',
                                    validate: {
                                        required: '[{"==":[{"var":"acquePubbliche"},"1"]}]'
                                    }
                                },
                                {
                                    type: 'textfield',
                                    label: 'Estremi concessione',
                                    key: 'estremiConcessione',
                                    validate: {
                                        required: '[{"==":[{"var":"acquePubbliche"},"1"]}]'
                                    }
                                },
                                {
                                    type: 'datetime',
                                    label: 'Data di fine validità',
                                    key: 'estremiCorsoAcqua',
                                    validate: {
                                        required: '[{"==":[{"var":"acquePubbliche"},"1"]}]'
                                    }
                                }
                            ]
                        },
                        {
                            key: 'impresaBlock',
                            type: 'fieldset',
                            legend: 'Dati Impresa',
                            components: [
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'denominazioneImpresaAppartenenza',
                                                    label: 'Denominazione impresa',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: 'false'
                                                    },
                                                    readOnly: false
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'partitaIva',
                                                    label: 'P.IVA Impresa',
                                                    type: 'textfield',
                                                    validate: {
                                                        maxLength: 11,
                                                        required: 'false'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'codiceFiscale Impresa',
                                                    label: 'Cod. Fisc. Impresa',
                                                    type: 'textfield',
                                                    validate: {
                                                        maxLength: 16,
                                                        required: 'false'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    key: 'comuneSede',
                                                    label: 'Comune sede legale',
                                                    type: 'autocomplete',
                                                    validate: {
                                                        required: true
                                                    },
                                                    input: true,
                                                    data: {
                                                        url: 'rvcp-comuni',
                                                        values: [],
                                                        autocompleteType: 'server',
                                                        method: 'GET',
                                                        mapFieldToFormKey: {
                                                            provincia: 'provinciaResidenza'
                                                        },
                                                        params: {
                                                            codice: ''
                                                        }
                                                    },
                                                    dataSrc: 'url',
                                                    valueProperty: 'id',
                                                    labelProperty: 'nome'
                                                }
                                            ]
                                        },
                                        {
                                            components: [
                                                {
                                                    key: 'indirizzoSede',
                                                    label: 'Indirizzo sede legale',
                                                    type: 'textfield',
                                                    validate: {
                                                        required: 'false'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    key: 'columns',
                                    type: 'columns',
                                    columns: [
                                        {
                                            components: [
                                                {
                                                    type: 'textfield',
                                                    label: 'Contatti',
                                                    key: 'Contatti'
                                                }
                                            ]
                                        }
                                    ]
                                },
                            ]
                        },
                    ]
                }
            ],
            suffix: '',
            hidden: false,
            validate: {
                custom: ''
            },
            input: true,
            data: {}
        }
    ]
}
