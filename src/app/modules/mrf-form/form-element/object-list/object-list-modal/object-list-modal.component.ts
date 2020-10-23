import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {UtilityService} from '../../../shared/services/utility/utility.service';
import {IFormElement, IFormTableColumn} from '../../../shared/models/form-element.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mrf-object-list-modal',
  templateUrl: './object-list-modal.component.html',
  styleUrls: ['./object-list-modal.component.scss']
})
export class ObjectListModalComponent implements OnInit, AfterViewInit {

  /**
   * Elenco colonne da visualizzare
   */
  displayedColumns: string[];

  /**
   * Dati in tabella
   */
  dataSource: MatTableDataSource<any>;

  /**
   * Modello di selezione
   */
  selection = new SelectionModel<any>(true, []);

  /**
   * Paginator
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  resultsLength = 0;
  resultsPageNumber = 0;
  resultsPageSize = 5;

  /**
   * Input search
   */
  @ViewChild('searchFullText') searchFullText: ElementRef;

  /**
   * Definizione colonne
   */
  columnsDefinition: IFormTableColumn[] = [];
  disabled: any;

  constructor(
    public dialogRef: MatDialogRef<ObjectListModalComponent>,
    private http: HttpClient,
    private utility: UtilityService,
    private changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  ngOnInit() {
    this.columnsDefinition = this.data.field.columnsDefinition;
    if (Array.isArray(this.data.selected)) {
      this.selection.select(...this.data.selected);
    }
    this.displayedColumns = ['select'];
    for (const col of this.columnsDefinition) {
      this.displayedColumns.push(col.value);
    }
    this.dataSource = new MatTableDataSource<any>([]);
  }


  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          const page = this.paginator.pageIndex;
          const size = this.paginator.pageSize;
          let URI: string = this.data.field.domainUrl.replace(
            '${page}',
            '' + page
          );
          URI = URI.replace('${size}', '' + size);
          const searchTerm = this.searchFullText.nativeElement.value;
          if (!!searchTerm) {
            URI += '&searchFullText=' + searchTerm;
          }
          if (this.data.field.dataSrc === 'values') {
            return of(this.data.field.data.values);
          }
          return this.http.get<any>(URI);
        }),
        map(data => {
          return data;
        }),
        catchError(() => {
          return of([]);
        })
      )
      .subscribe(data => {
        this.dataSource.data = data.elements;
        this.resultsPageNumber = data.currentPage;
        this.resultsLength = data.totalElements;
        this.resultsPageSize = data.currentSize;
        this.changeDetector.markForCheck();
      });
  }

  searchCodiceDescrizione(value: any): void {
    const refreshPage = new PageEvent();
    refreshPage.pageIndex = 0;
    refreshPage.pageSize = this.paginator.pageSize;
    this.paginator.page.emit(refreshPage);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  // Close window on cancel
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Selection.isSelected fallisce quando si cambia pagina
   * Questa funzione serve a visualizzare come selezionate le righe che
   * corrispondono per valore a una delle righe già selezionate
   */
  isSelected(row) {
    for (const itemSelected of this.selection.selected) {
      if (this.utility.areEquivalent(row, itemSelected, this.data.field.idProperty)) {
        return true;
      }
    }
    return false;
  }

  selectDeselect(row, $event): void {
    if ($event.checked) {
      return this.selection.select(row);
    }
    for (const itemSelected of this.selection.selected) {
      if (this.utility.areEquivalent(row, itemSelected, this.data.field.idProperty)) {
        this.selection.deselect(itemSelected);
      }
    }
  }
}
