import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddQuizQuestionPage } from './add-quiz-question.page';

const routes: Routes = [
  {
    path: '',
    component: AddQuizQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddQuizQuestionPageRoutingModule {}
