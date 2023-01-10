import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, NgForm, NgModel} from '@angular/forms';
import {RepeatableService} from '../../../layout/repeatable-container/repeatable.service';
import {UtilityService} from '../../services/utility/utility.service';

@Directive({
    selector: '[mrfRegisterForm]'
})
export class RegisterFormModelDirective implements OnInit, OnDestroy {

    @Input() public registerForm: NgForm;
    @Input() public registerModel: NgModel;

    constructor() {
    }

    ngOnInit(): void {
        if (this.registerForm && this.registerModel) {
            this.registerForm.form.addControl(this.registerModel.name, this.registerModel.control);
        }
    }

    ngOnDestroy(): void {
        // Non distruggere il form prima che sia stato inizializzato
        if (!this.registerForm || !this.registerModel) {
            return;
        }
        this.registerForm.removeControl(this.registerModel);
    }
}
