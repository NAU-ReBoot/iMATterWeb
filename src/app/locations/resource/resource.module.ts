import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourcePageRoutingModule } from './resource-routing.module';

import { ResourcePage } from './resource.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ResourcePageRoutingModule
  ],
  declarations: [ResourcePage]
})
export class ResourcePageModule {}
