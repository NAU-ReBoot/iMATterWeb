import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatesContentPage } from './updates-content.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatesContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatesContentPageRoutingModule {}
