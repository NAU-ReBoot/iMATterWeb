import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumPage } from './forum.page';

const routes: Routes = [
  {
    path: '',
    component: ForumPage
  },
  {
    path: 'infoDesk-details',
    loadChildren: () => import('./forum-details/forum-details.module').then( m => m.ForumDetailsPageModule)
  },
  { path: 'forum-thread/:id', loadChildren: './forum-thread/forum-thread.module#ForumThreadPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumPageRoutingModule {}
