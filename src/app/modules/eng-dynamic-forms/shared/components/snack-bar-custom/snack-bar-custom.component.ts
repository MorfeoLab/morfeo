import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'mrf-snack-bar-custom',
  templateUrl: './snack-bar-custom.component.html',
  styleUrls: ['./snack-bar-custom.component.scss']
})
export class SnackBarCustomComponent {
  constructor(
    public snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
  }

  public dismissSnackbar(): void {
    this.snackBar.dismiss();
  }
}
