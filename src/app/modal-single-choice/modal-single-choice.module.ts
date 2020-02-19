import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalSingleChoicePageRoutingModule } from './modal-single-choice-routing.module';

import { ModalSingleChoicePage } from './modal-single-choice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalSingleChoicePageRoutingModule
  ],
  declarations: [ModalSingleChoicePage]
})
export class ModalSingleChoicePageModule {}
