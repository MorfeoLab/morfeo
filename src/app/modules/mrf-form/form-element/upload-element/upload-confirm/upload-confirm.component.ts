import {Component, Inject, OnInit} from '@angular/core';
import {FileUploadModel} from '../upload-element.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mrf-upload-confirm',
  templateUrl: './upload-confirm.component.html',
  styleUrls: ['./upload-confirm.component.scss']
})
export class UploadConfirmComponent implements OnInit {

  public file: FileUploadModel;
  public type: string;

  constructor(
    private dialogRef: MatDialogRef<UploadConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.file = data.file;
    this.type = data.type || 'delete';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }


}
