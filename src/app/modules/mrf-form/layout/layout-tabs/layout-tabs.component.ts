import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {TabsService} from '../../shared/services/tabs/tabs.service';
import {NgForm} from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';
import {UtilityService} from '../../shared/services/utility/utility.service';
import {ConditionalService} from '../../shared/services/conditional/conditional.service';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'mrf-layout-tabs',
  templateUrl: './layout-tabs.component.html',
  styleUrls: ['./layout-tabs.component.scss']
})
export class LayoutTabsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @Input() field: IFormElement;
  @Input() formRef: NgForm;
  @Input() externalData: { [key: string]: any };
  @Input() readOnly: boolean;

  constructor(
    private tabsService: TabsService,
    public utility: UtilityService,
    private conditionalService: ConditionalService
  ) {
  }

  ngOnInit() {
    if (!!this.field) {
      this.field.components = this.field.components || [];
      for (const component of this.field.components) {
        component.suffix = this.field.suffix || '';
        /**
         * Iscrive il tab al servizio condizionale
         */
        if (this.utility.isJSON(component.hidden)) {
          this.registerTabConditional(component);
          /// Assicuriamoci di mostrare almeno una volta il contenuto
          component.hidden = false;
        }
      }
    }
  }

  ngAfterViewInit(): void {
    this.tabsService.registerTabGroup(this.tabGroup);
    this.tabsService.registerJson(this.field);
  }

  getPrintableLabel(tab) {
    const maxLength = 32;
    let op = '';
    if (!this.utility.isNullOrUndefined(tab)) {
      op = tab.label;
      if (!this.utility.isNullOrUndefined(tab.localizedLabel)) {
        op = tab.localizedLabel.it;
      }
    }
    if (op.length > maxLength) {
      op = op.substr(0, maxLength - 1) + '…';
    }
    return op;
  }

  refreshSubTabs(index ) {
    this.field.selectedIndex = index;
    /**
     * L'ultimo tab annidato non mostra lo stato corrretto, è un bug noto di Angular Material
     * Per ovviare al problema è necessario scatenare manualmente l'evento resize della finestra
     */
    let event: Event;
    if (typeof (Event) === 'function') {
      /// Per i browser veri
      event = new Event('resize');
    } else {
      /// Per Internet Explorer
      event = document.createEvent('Event');
      event.initEvent('resize', true, true);
    }
    setTimeout(() => {
      window.dispatchEvent(event);
    }, 600);
  }

  registerTabConditional(tab: IFormElement) {
    tab.input = true;
    this.conditionalService.registerJsonRule(
      this.formRef,
      tab,
      (tab.hidden as string),
      this.externalData,
      (v) => {
        for (const valid of v) {
          if (!valid) {
            tab.hidden = false;
            return;
          }
          tab.hidden = true;
        }
      }
    );
  }

  tabChange($event: MatTabChangeEvent)  {
    this.tabsService.$eventHandler.next({
      callback: 'tabHasChanged',
      index: $event.index,
      tab: $event.tab
    });
  }
}
