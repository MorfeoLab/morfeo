import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UtilityService} from '../../services/utility/utility.service';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mrf-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss']
})
export class ListModalComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  public dataSource;
  public showTable = true;

  constructor(
    public dialogRef: MatDialogRef<ListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListModalData,
    public utility: UtilityService
  ) {
  }

  ngOnInit() {
    this.data.config = this.data.config || {};
    this.data.labels = this.data.labels || {};
    if (this.utility.isNullOrUndefined(this.data.config.showFilter)) {
      this.data.config.showFilter = true;
    }
    if (this.utility.isNullOrUndefined(this.data.labels.searchField)) {
      this.data.labels.searchField = 'Filter';
    }
    if (this.utility.isNullOrUndefined(this.data.labels.noRecords)) {
      this.data.labels.noRecords = 'No records found';
    }
    if (this.utility.isNullOrUndefined(this.data.records)) {
      this.showTable = false;
      return;
    }
    if (this.data.config && Array.isArray(this.data.config.displayedColumns)) {
      this.displayedColumns = this.data.config.displayedColumns;
    } else {
      this.displayedColumns = [];
      if (this.data.records.length) {
        for (const column in this.data.records[0]) {
          if (this.data.records[0].hasOwnProperty(column)) {
            if (typeof this.data.records[0][column] === 'string') {
              this.displayedColumns.push(column);
            }
          }
        }
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.data.records);
  }

  ngAfterViewInit() {
    if (this.showTable) {
      this.dataSource.paginator = this.paginator;
    }
  }

  keyUpFilterField(filterFieldEvent: Event) {
    const filterField = filterFieldEvent.target as HTMLInputElement;
    this.dataSource.filter = filterField.value.trim().toLowerCase();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface ListModalData {
  title: string;
  message: string;
  records?: any[];
  item?: any;
  config?: {
    columnTitleRenderer?: (s: string) => string,
    columnValueRenderer?: {
      [k: string]: (s: any) => string
    },
    displayedColumns?: string[],
    showFilter?: boolean
  };
  labels: {
    confirmButton?: string,
    cancelButton?: string,
    noRecords?: string,
    searchField?: string
  };
}
