import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderHomePage } from './provider-home.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderHomePage
  },
  {
    path: 'forum-details',
    loadChildren: () => import('../../forum/forum-details/forum-details.module').then(m => m.ForumDetailsPageModule)
  },
  {
    path: 'forum-thread',
    loadChildren: () => import('../../forum/forum-thread/forum-thread.module').then(m => m.ForumThreadPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderHomePageRoutingModule {}
