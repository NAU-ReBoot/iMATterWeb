import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LearningmodulesPage } from './learningmodules.page';

const routes: Routes = [
  {
    path: '',
    component: LearningmodulesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearningmodulesPageRoutingModule {}
