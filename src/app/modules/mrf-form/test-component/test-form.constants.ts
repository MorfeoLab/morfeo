import {IForm} from '../shared/models/form-element.model';

export const TEST_FORM: IForm = {
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
