import { Component, OnInit } from '@angular/core';
import { Question } from '../../services/learning-module.service';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-quiz-modal',
  templateUrl: './quiz-modal.page.html',
  styleUrls: ['./quiz-modal.page.scss'],
})
export class QuizModalPage implements OnInit {

  //These come from the componentProps that was passed into this modal from learning-module.content.page
  //They needed to be declared before use
  text:string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correctAnswer: string;
  pointsWorth: number;

  constructor(private modalController: ModalController, public alertController: AlertController) { }

  ngOnInit() {

  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async deleteQuestion(text:string)
  {
    //if we're deleting a question, pass the text of the question to be deleted back to learning-module-content
    await this.modalController.dismiss(text);

  }

  async deleteQuestionConfirmation() {
    const alert = await this.alertController.create({
      header: 'Delete Question?',
      message: 'Are you sure you want to delete this question?',
      buttons: [
        {text: 'Cancel'}, 
        {text: 'Delete',
        handler: () => {
          this.deleteQuestion(this.text);
        }}
      ]
    });

    await alert.present();
  }
}
