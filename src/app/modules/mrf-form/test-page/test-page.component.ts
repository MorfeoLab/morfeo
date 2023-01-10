import { Component, OnInit } from '@angular/core';
import {IForm} from '../shared/models/form-element.model';

@Component({
  selector: 'mrf-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
  public testFormJson: IForm;

  constructor() { }

  ngOnInit(): void {
  }

}
