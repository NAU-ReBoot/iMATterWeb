import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderInboxPage } from './provider-inbox.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderInboxPage
  },
  {
    path: 'message/:id',
    loadChildren: () => import('./message/message.module').then( m => m.MessagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderInboxPageRoutingModule {}
