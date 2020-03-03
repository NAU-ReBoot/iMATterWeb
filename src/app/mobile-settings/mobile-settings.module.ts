import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MobileSettingsPageRoutingModule } from './mobile-settings-routing.module';

import { MobileSettingsPage } from './mobile-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MobileSettingsPageRoutingModule
  ],
  declarations: [MobileSettingsPage]
})
export class MobileSettingsPageModule {}
