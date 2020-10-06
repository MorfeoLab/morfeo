import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {IFormElement} from '../../shared/models/form-element.model';

export class TableEl {
  col0: any;
}

@Component({
  selector: 'mrf-layout-tables',
  templateUrl: './layout-tables.component.html',
  styleUrls: ['./layout-tables.component.scss']
})
export class LayoutTablesComponent implements OnInit {
  @Input() table: IFormElement;
  @Input() formRef: NgForm;
  @Input() externalData: {[key: string]: any};
  @Input() readOnly: boolean;

  constructor() {}

  public datasource: TableEl[] = [];

  public displayedColumns: string[] = [];

  ngOnInit() {
    if (!this.table) {
      return;
    }
    for (const row of this.table.rows) {
      for (const col of row) {
        for (const component of col.components) {
          component.suffix = this.table.suffix;
        }
      }
    }
    // formio table is a matrix, angular material mat-table needs as datasource an array of obj
    // whose field we'll be the column of the table
    // for (let j = 0; j < this.tables.rows.length; j++) {
    //   const element: TableEl = new TableEl();
    //   for (let i = 0; i < this.tables.rows[j].length; i++) {
    //
    //     element['col' + i] = this.tables.rows[j][i].components;
    //     element['col' + i][0].suffix = this.tables.suffix;
    //   }
    //   console.log(element)
    //   this.datasource.push(element);
    // }
    // for (let i = 0; i < this.tables.rows[0].length; i++) {
    //   this.displayedColumns.push('col' + i);
    // }
  }
}
