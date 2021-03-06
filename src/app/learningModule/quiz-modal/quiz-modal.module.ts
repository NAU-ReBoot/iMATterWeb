import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuizModalPageRoutingModule } from './quiz-modal-routing.module';
import { QuizModalPage } from './quiz-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    QuizModalPageRoutingModule
  ],
  declarations: [QuizModalPage]
})
export class QuizModalPageModule {}
