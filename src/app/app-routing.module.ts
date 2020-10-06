import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslatablePipe } from './modules/eng-dynamic-forms/shared/pipes/translatable/translatable.pipe';
import { TestComponentComponent } from './modules/eng-dynamic-forms/test-component/test-component.component';
import { EngDynamicFormsModule } from './modules/eng-dynamic-forms/eng-dynamic-forms.module';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'test',
    pathMatch: 'full'
  },
  {
    path: 'test',
    component: TestComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), EngDynamicFormsModule],
  exports: [RouterModule],
  providers: [TranslatablePipe]
})
export class AppRoutingModule {}
