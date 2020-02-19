import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumDetailsPage } from './forum-details.page';

const routes: Routes = [
  {
    path: '',
    component: ForumDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumDetailsPageRoutingModule {}
