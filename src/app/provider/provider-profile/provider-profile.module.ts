import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderProfilePageRoutingModule } from './provider-profile-routing.module';

import { ProviderProfilePage } from './provider-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProviderProfilePageRoutingModule
  ],
  declarations: [ProviderProfilePage]
})
export class ProviderProfilePageModule {}
