import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyListPage } from './survey-list.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyListPageRoutingModule {}
