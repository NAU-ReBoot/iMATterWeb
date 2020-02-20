import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdatePageRoutingModule } from './add-update-routing.module';

import { AddUpdatePage } from './add-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUpdatePageRoutingModule
  ],
  declarations: [AddUpdatePage]
})
export class AddUpdatePageModule {}
