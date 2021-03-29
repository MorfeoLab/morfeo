import {IForm} from '../shared/models/form-element.model';

export const TEST_FORM: IForm = {
    components: [
        {
            key: 'provinciaResidenza',
            label: 'Provincia residenza',
            type: 'textfield',
            valueProperty: 'value',
            labelProperty: 'label',
            readOnly: true
        },
        {
            key: 'comuneResidenza',
            label: 'Comune di residenza',
            type: 'autocomplete',
            data: {
                params: { codice: '' },
                mapFieldToFormKey: {
                    provincia: 'provinciaResidenza'
                },
                values: [
                    {
                        value: '1',
                        label: 'Uno',
                        provincia: 'Hai selezionato UNO'
                    },
                    {
                        value: '2',
                        label: 'Due',
                        provincia: 'Hai selezionato DUE'
                    },
                    {
                        value: '3',
                        label: 'Tre',
                        provincia: 'Hai selezionato TRE'
                    }
                ]
            },
            dataSrc: 'values',
            valueProperty: 'value',
            labelProperty: 'label',
            validate: {
                required: true
            }
        }
    ]
}
