import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderHomePageRoutingModule } from './provider-home-routing.module';

import { ProviderHomePage } from './provider-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProviderHomePageRoutingModule
  ],
  declarations: [ProviderHomePage]
})
export class ProviderHomePageModule {}
