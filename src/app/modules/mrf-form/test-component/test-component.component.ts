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
    private mainFormJson: IForm;

    constructor() {
        this.mainFormJson = TEST_FORM;
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
            key: 'oraEmissioneMarca',
            label: 'Ora emissione Marca (hh:mm:ss)',
            type: 'textfield',
            validate: {
                custom: '[{"regex":["^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$",{"var":"oraEmissioneMarca"}]}]',
                required: true
            }
        }
    ]
}
