import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatlogPage } from './chatlog.page';

const routes: Routes = [
  {
    path: '',
    component: ChatlogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatlogPageRoutingModule {}
