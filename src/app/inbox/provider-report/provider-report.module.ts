import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderReportPageRoutingModule } from './provider-report-routing.module';

import { ProviderReportPage } from './provider-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProviderReportPageRoutingModule
  ],
  declarations: [ProviderReportPage]
})
export class ProviderReportPageModule {}
