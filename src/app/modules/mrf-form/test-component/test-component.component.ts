import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IForm} from '../shared/models/form-element.model';
import {MrfFormComponent} from '../mrf-form.component';

@Component({
    selector: 'mrf-test-component',
    templateUrl: './test-component.component.html',
    styleUrls: ['./test-component.component.scss']
})
// Component used to test and develop the library
export class TestComponentComponent implements AfterViewInit {
    title = 'morfeo';

    public mainFormObj: NgForm;
    @ViewChild('mainForm', {static: true}) public mainFormContainer: MrfFormComponent;
    public mainFormJson: IForm;

    constructor() {
        this.mainFormJson = TEST_FORM;
    }

    public clickMe() {
        console.log(TEST_VALUE);
        console.log(this.mainFormContainer.f.value);
        this.mainFormContainer.f.resetForm({...this.mainFormContainer.f.value, ...TEST_VALUE});
    }

    public clickMe2() {
        this.mainFormContainer.f.setValue(TEST_VALUE_2);
    }

    ngAfterViewInit() {
        // this.mainFormContainer.formReadyEvent.subscribe(f => {
        //     this.mainFormObj = f;
        //     let lastValue = f.controls.oraEmissioneMarca.value;
        //     setInterval(() => {
        //         const currentValue = f.controls.oraEmissioneMarca.value;
        //         if (currentValue !== lastValue) {
        //             console.log(currentValue);
        //             lastValue = currentValue;
        //         }
        //     })
        // })
    }

}

const TEST_FORM: IForm = {
    components: [
        {
            type: 'textfield',
            key: 'textfield',
            label: 'Text Field'
        }
    ]
}


const TEST_VALUE = {
    datetime: '1980-11-30T23:00:00.000Z',
    uno: 3326,
    due: 'jay'
};

const TEST_VALUE_2 = {
    datetime: '1970-01-01T23:00:00.000Z',
    uno: 3326,
    due: 'kay'
};
