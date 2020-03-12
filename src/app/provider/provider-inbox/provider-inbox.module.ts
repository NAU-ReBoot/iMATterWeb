import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderInboxPageRoutingModule } from './provider-inbox-routing.module';

import { ProviderInboxPage } from './provider-inbox.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProviderInboxPageRoutingModule
  ],
  declarations: [ProviderInboxPage]
})
export class ProviderInboxPageModule {}
