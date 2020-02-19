import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatCohortListPage } from './chat-cohort-list.page';

const routes: Routes = [
  {
    path: '',
    component: ChatCohortListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatCohortListPageRoutingModule {}
