import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderReportPage } from './provider-report.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderReportPageRoutingModule {}
