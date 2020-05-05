import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveysPageRoutingModule } from './surveys-routing.module';

import { SurveysPage } from './surveys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SurveysPageRoutingModule
  ],
  declarations: [SurveysPage]
})
export class SurveysPageModule {}
