import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderProfilePage } from './provider-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderProfilePageRoutingModule {}
