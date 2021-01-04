import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {IFormMenu} from '../../shared/models/form-element.model';
import {MatSidenav} from '@angular/material/sidenav';
import {SideNavigationService} from '../../shared/services/side-navigation.service';

@Component({
  selector: 'mrf-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('sideNavigation', {static: true}) sn: MatSidenav;
  @Input() field: IFormMenu;
  public menu: any[];

  constructor(
      private sideNavigationService: SideNavigationService
  ) {
  }

  ngOnInit(): void {
    this.menu = this.field.menu;
  }

  ngAfterViewInit(): void {
    this.sideNavigationService.setSideNavigation(this.sn);
  }

}
