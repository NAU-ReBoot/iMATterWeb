import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyListPageRoutingModule } from './survey-list-routing.module';

import { SurveyListPage } from './survey-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveyListPageRoutingModule
  ],
  declarations: [SurveyListPage]
})
export class SurveyListPageModule {}
