import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizModalPage } from './quiz-modal.page';

const routes: Routes = [
  {
    path: '',
    component: QuizModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizModalPageRoutingModule {}
