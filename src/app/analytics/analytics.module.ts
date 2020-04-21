import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DatePickerModule } from 'ionic4-date-picker';

import { AnalyticsPageRoutingModule } from './analytics-routing.module';

import { AnalyticsPage } from './analytics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalyticsPageRoutingModule,
    DatePickerModule
  ],
  declarations: [AnalyticsPage]
})
export class AnalyticsPageModule {}
