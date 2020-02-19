import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddQuizQuestionPageRoutingModule } from './add-quiz-question-routing.module';

import { AddQuizQuestionPage } from './add-quiz-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddQuizQuestionPageRoutingModule
  ],
  declarations: [AddQuizQuestionPage]
})
export class AddQuizQuestionPageModule {}
