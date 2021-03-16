import {IForm} from '../shared/models/form-element.model';

export const TEST_FORM: IForm = {
    components: [
        {
            key: 'columns',
            label: 'Nome del Quadro',
            type: 'columns',
            columns: [
                {
                    components: [
                        {
                            'key': 'ELEMENT.FILE',
                            'label': 'generic.labels.caricaFirmata',
                            'input': true,
                            'className': '',
                            'disabled': false,
                            'description': '',
                            'type': 'file',
                            'hideLabel': true,
                            'tags': [],
                            'conditional': {},
                            'properties': {},
                            'target': '/suap/services/star/file/upload/pdfFirmato',
                            'accept': '*/*',
                            'singleUpload': false
                        }
                    ]
                },
                {
                    components: [
                        {
                            'key': 'ELEMENT.FILE2',
                            'label': 'generic.labels.caricaFirmata',
                            'input': true,
                            'className': '',
                            'disabled': false,
                            'description': '',
                            'type': 'file',
                            'hideLabel': true,
                            'tags': [],
                            'conditional': {},
                            'properties': {},
                            'target': '/suap/services/star/file/upload/pdfFirmato',
                            'accept': '*/*',
                            'singleUpload': false
                        }
                    ]
                }
            ]
        }
    ]
}
