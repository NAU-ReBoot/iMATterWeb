import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalSingleChoicePage } from './modal-single-choice.page';

const routes: Routes = [
  {
    path: '',
    component: ModalSingleChoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalSingleChoicePageRoutingModule {}
