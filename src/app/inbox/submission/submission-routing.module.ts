import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmissionPage } from './submission.page';

const routes: Routes = [
  {
    path: '',
    component: SubmissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmissionPageRoutingModule {}
