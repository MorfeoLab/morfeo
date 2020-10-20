import { Injectable } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SideNavigationService {
  private sideNavigation: MatSidenav;

  constructor() { }

  public toggle() {
    if (!!this.sideNavigation) {
      this.sideNavigation.toggle().then(() => {});
    }
  }

  public setSideNavigation(sn: MatSidenav) {
    this.sideNavigation = sn;
  }
}
