import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatesContentPageRoutingModule } from './updates-content-routing.module';

import { UpdatesContentPage } from './updates-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatesContentPageRoutingModule
  ],
  declarations: [UpdatesContentPage]
})
export class UpdatesContentPageModule {}
