import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobileSettingsPage } from './mobile-settings.page';

const routes: Routes = [
  {
    path: '',
    component: MobileSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileSettingsPageRoutingModule {}
