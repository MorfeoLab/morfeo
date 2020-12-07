import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestComponentComponent} from './modules/mrf-form/test-component/test-component.component';
import {MrfFormModule} from './modules/mrf-form/mrf-form.module';
import {TranslatablePipe} from './modules/mrf-form/shared/pipes/translatable/translatable.pipe';
import {TestPageComponent} from './modules/mrf-form/test-page/test-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'test',
    pathMatch: 'full'
  },
  {
    path: 'test',
    component: TestComponentComponent
  },
  {
    path: 'test2',
    component: TestPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MrfFormModule],
  exports: [RouterModule],
  providers: [TranslatablePipe]
})
export class AppRoutingModule {}
