import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PregnancyUpdatesPageRoutingModule } from './pregnancy-updates-routing.module';

import { PregnancyUpdatesPage } from './pregnancy-updates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PregnancyUpdatesPageRoutingModule
  ],
  declarations: [PregnancyUpdatesPage]
})
export class PregnancyUpdatesPageModule {}
