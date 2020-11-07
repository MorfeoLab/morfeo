import {AfterContentChecked, AfterViewInit, Component, Input} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {MrfFormComponent} from '../../mrf-form.component';
import {TranslatablePipe} from '../../shared/pipes/translatable/translatable.pipe';
import {ValueService} from '../../shared/services/value/value.service';

@Component({
  selector: 'mrf-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss'],
  viewProviders: [
    {
      provide: MrfFormComponent,
      useExisting: NgForm
    }
  ]
})
export class TextElementComponent implements AfterViewInit, AfterContentChecked {
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() readOnly: boolean;

  private notFoundBase64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4RK+RXhpZgAASUkqAAgAAAAGABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAADEBAgANAAAAZgAAADIBAgAUAAAAdAAAAGmHBAABAAAAiAAAAJoAAAAsAQAAAQAAACwBAAABAAAAR0lNUCAyLjEwLjIwAAAyMDIwOjEwOjE5IDE0OjQxOjQwAAEAAaADAAEAAAABAAAAAAAAAAgAAAEEAAEAAAAAAQAAAQEEAAEAAAAAAQAAAgEDAAMAAAAAAQAAAwEDAAEAAAAGAAAABgEDAAEAAAAGAAAAFQEDAAEAAAADAAAAAQIEAAEAAAAGAQAAAgIEAAEAAACvEQAAAAAAAAgACAAIAP/Y/+AAEEpGSUYAAQEAAAEAAQAA/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgBAAEAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACio2niQ4aVFPoWAqC61K0tLWSeW4jCIpY/MKAMvUfGGk6ZePazvIZU+9sTIB9M1V/wCFgaJ63H/fr/69eX3dw95eTXMn35XLH8ahoA9W/wCFgaJ63H/fr/69WtO8YaTqd4lrA8glf7u9MAn0zXj9TWlw9neQ3Mf34nDD8KAPeaKp2upWl3axzxXEZR1DA7hSXmrWVhbNcXF1EkS9W3A/h9aG7ascYuT5Yq7LtFZ+kavBrVgLy2EixsxUCRcHitCkmmroc4ShJxkrNBRRRTJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACsrxJqEmmeH7u7h/1iKAp9CSBn9a1a5/xv/yKN79Y/wD0NaAPJJppbiQyTSM7sclmOSajopVUswUDJJwB70AWtO0y71W6FvaRF37nso9Se1drZ/DdSgN7fNuPVYVHH4n/AAro9E0y28OaH+8wrBfMnkPc4/pXGar4/wBQnnZdP220IPysVDMfz4oA0Lz4bKEJsr5t3ZZl6/iK4vUNLu9Muza3ULLJ/D3DD29a6bSvHeowHdqZSW1zgyEBW/DHU+2Kt3A1jxr+8jtzY6ZFlo3Zf3spx0U9s/l9azlUSdlqzroYSdSPtJPlh3f6d36HFw2ry3CwRxtcXLcLBHz/AN9HtVm8tZNLuBHexb7pRlYiuI4/cD+L+X1pkGpS6fcxmyjWBYZA20c7mH94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'

  public inputType: string;

  /**
   * L'etichetta da rappresentare
   */
  public displayLabel: string;
  public displayLegend: string;

  /**
   * Conserviamo il precedente valore booleano di visibilità
   * per conoscere il momento in cui cambia
   */
  private componentWasVisible: boolean;
  valueNgModel: any = '';
  calcolatoEDisabilitato = false;

  constructor(
    private translatable: TranslatablePipe,
    private valueService: ValueService
  ) {
    if (!this.field) {
      return;
    }
    this.field.suffix = this.field.suffix || '';
  }

  ngAfterViewInit() {
    this.inputType = this.getValidType();
    /**
     * Calcolo l'etichetta da rappresentare in base ai valori di label e hideLabel
     */
    if (!!this.field.hideLabel) {
      this.displayLabel = '';
      this.displayLegend = null;
    } else {
      this.displayLabel = this.translatable.transform(this.field.label);
      this.displayLegend = this.translatable.transform(this.field.legend);
    }
    if(!!this.field.calculatedValue) {
      if(!!this.field.disabled) {
        this.calcolatoEDisabilitato = true;
      }
    }
    if (this.field.defaultValue) {
      setTimeout(() => {
        const defaultValue = {};
        defaultValue[this.field.key + this.field.suffix] = String(this.field.defaultValue);
        this.formRef.setValue(defaultValue);
      }, 10);
    }
    if((!!this.field.input && !!this.field.disabled) || this.readOnly) {
      this.formRef.controls[this.field.key + this.field.suffix].valueChanges.subscribe(e => {
        this.valueNgModel = e !== undefined ? e : null;
        if (!this.formRef.controls[this.field.key + this.field.suffix].value && this.field.defaultValue)
          this.formRef.controls[this.field.key + this.field.suffix].patchValue(this.field.defaultValue);
      })
    }
    if(!!this.field.jsonLogic && !!this.field.jsonLogic.validate) {
      if (typeof this.field.jsonLogic.validate === 'string') {
        // 16/07/2020 la validazione dei campi con espressione regolare sull'idsemantico di tipo testo non funzionava
        // viene adesso introdotta la gestione con il campo pattern nativo
        // per evitare errori sul pregresso dovute a regole generate male sul BE introduco questo controllo
        // per cui in caso di regole definite in questo modo
        //   validate: '{"regex": ["^.*$", "{var:"NOME_CONTROLLO"}]}'
        // mi recupero l'espressione regolare in questo modo
        if (!!this.field.jsonLogic.validate.includes('regex')) {
          if (!this.field.validate) {
            this.field.validate = {};
          }
          try {
            const splitted = this.field.jsonLogic.validate.split('{"regex": ["');
            const splitted2 = splitted[1].split('", "{var:"');
            console.log(splitted2[0]);
            let regex = splitted2[0];
            // con la RTOS_DT-1008 ci hanno passato una regex email che non funziona, per retrocompatibilità metto sta roba
            // non rifatelo a casa
            if (regex === '[A-z0-9!#$%&*+/=?^_`\\{|}~-](?:\\.[A-z0-9!#$%&*+/=?^_`\\{|}~-])@(?:[A-z0-9](?:[A-z0-9-][A-z0-9])?\\.)+[A-z0-9](?:[A-z0-9-]*[A-z0-9])?.') {
              regex = '^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
            }
            this.field.validate.pattern = regex;
          } catch (e) {
            console.log('Error on ' + this.field.key);
          }
        }
      }
    }
  }

  getValidType() {
    let type = 'text';
    switch (this.field.type) {
      case 'image':
        type = this.field.type;
        break;
      case 'email':
        type = this.field.type;
        break;
      case 'password':
        type = this.field.type;
        break;
      case 'number':
        type = this.field.type;
        break;
      case 'textfield':
        type = 'text';
        break;
      case 'phoneNumber':
        type = 'tel';
        break;
      default:
        console.log('Unrecognized type' + this.field.type);
        type = 'text';
    }
    return type;
  }

  errorHandler(event) {
    event.target.src = this.notFoundBase64Image;
  }

  /**
   * Se l'elemento è nascosto deve perdere il valore
   */
  ngAfterContentChecked() {
    /// Se il componente è appena comparso ricarica il valore dal form
    const componentIsVisible = this.valueService.isVisible(this.field);
    const componentId = this.field.key + this.field.suffix;
    if (componentIsVisible) {
      if (!this.componentWasVisible) {
        /// Componente appena comparso
      }
    } else {
      if (this.componentWasVisible) {
        /// Componente appena nascosto
        const componentCount = this.valueService.visibleCount;
        if (!componentCount[componentId]) {
          /// Non ci sono altri controlli con lo stesso nome
          if (this.formRef.controls.hasOwnProperty(componentId)) {
            this.formRef.controls[componentId].setValue(null, {
              onlySelf: true,
              emitEvent: false
            });
          }
        }
      }
    }
    this.componentWasVisible = !!componentIsVisible;
  }
}
