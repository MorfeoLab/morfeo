import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {IFormElement} from '../../../shared/models/form-element.model';
import {FormControl, NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'mrf-read-only-trad',
  templateUrl: './read-only-trad.component.html',
  styleUrls: ['./read-only-trad.component.scss']
})
export class ReadOnlyTradComponent implements OnInit, AfterViewInit {

  @Input() field: IFormElement;
  @Input() formRef: NgForm;

  public hiddenControl: FormControl;
  public htmlValue: any = '';
  public languages;
  constructor(public translate: TranslateService) {
    this.translate.onLangChange.subscribe((currentLang: {lang: string, translations: any;}) => {
      if (this.languages !== null && this.languages !== '') {
        this.htmlValue = this.languages[currentLang.lang];
      }
    });
  }

  ngOnInit() {
    this.field.suffix = this.field.suffix || '';
  }

  registerHiddenFieldListener() {
    this.hiddenControl.valueChanges.subscribe((v: any) => {
      const currentLang = this.translate.currentLang;
      if (v !== null && v !== '') {
        this.languages = v;
        this.htmlValue = v[currentLang];
      }
    });
  }

  ngAfterViewInit(): void {

    this.hiddenControl = this.formRef.controls[
    this.field.key + this.field.suffix
      ] as FormControl;

    setTimeout(() => {
      this.hiddenControl.setValue(null);
    }, 0);

    this.registerHiddenFieldListener();
  }
}
