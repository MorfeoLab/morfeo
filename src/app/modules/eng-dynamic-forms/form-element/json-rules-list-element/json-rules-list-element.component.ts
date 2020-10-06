import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {IForm, IFormElement} from '../../shared/models/form-element.model';
import {NgForm} from '@angular/forms';
import {EngDynamicFormsComponent} from '../../eng-dynamic-forms.component';

@Component({
  selector: 'mrf-json-rules-list-element',
  templateUrl: './json-rules-list-element.component.html',
  styleUrls: ['./json-rules-list-element.component.scss']
})
export class JsonRulesListElementComponent implements OnInit, AfterViewInit {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;
  /**
   * Una riga per ogni ripetizione
   */
  public rows: any[] = [];

  /**
   * Elenco delle opzioni per la select
   */
  public formJson = formJson;

  /**
   * Un riferimento al form generato dal componente
   */
  private internalFormRef: NgForm;

  public hiddenControlVal: any;

  @ViewChild(EngDynamicFormsComponent) private formElement: EngDynamicFormsComponent;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.field.suffix = this.field.suffix || '';
  }

  ngAfterViewInit(): void {

    this.formElement.formReadyEvent.subscribe(f => {
      this.internalFormRef = f;
      this.internalFormRef.valueChanges.subscribe(val => {
        const output = {};
        for (const prop in val) {
          if (val.hasOwnProperty(prop)) {
            const splitVal = val[prop] && prop.split(':');
            if (!!splitVal && splitVal.length === 2 && splitVal[0] === 'select') {
              if (!!val['rule:' + splitVal[1]]) {
                output[val[prop]] = val['rule:' + splitVal[1]];
              }
            }
          }
        }
        this.hiddenControlVal = output;
        this.changeDetector.detectChanges();
      });
    });
  }
}

const formJson: IForm = {
  components: [
    {
      type: 'repeatable',
      components: [
        {
          type: 'columns',
          columns: [
            {
              components: [
                {
                  type: 'select',
                  label: 'Component',
                  key: 'select',
                  data: {
                    values: [
                      {
                        label: 'Mammolo',
                        value: 'mammolo'
                      },
                      {
                        label: 'Pisolo',
                        value: 'pisolo'
                      },
                      {
                        label: 'Eolo',
                        value: 'eolo'
                      },
                      {
                        label: 'Dotto',
                        value: 'dotto'
                      },
                      {
                        label: 'Gongolo',
                        value: 'gongolo'
                      },
                      {
                        label: 'Brontolo',
                        value: 'brontolo'
                      },
                      {
                        label: 'Cucciolo',
                        value: 'cucciolo'
                      }
                    ]
                  },
                  validate: {}
                },
              ],
            },
            {
              components: [
                {
                  type: 'jsonRule',
                  key: 'rule'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
