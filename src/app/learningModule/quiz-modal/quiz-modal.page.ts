import { Component, OnInit } from '@angular/core';
import { LearningModuleService, LearningModule, Question } from '../../services/learning-module.service';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-modal',
  templateUrl: './quiz-modal.page.html',
  styleUrls: ['./quiz-modal.page.scss'],
})
export class QuizModalPage implements OnInit {

  //These come from the componentProps that was passed into this modal from learning-module.content.page
  //They needed to be declared before use
  currentLearningModule: LearningModule;
  currentQuizQuestion: Question;

  //The reference to the quiz question within the currentLearningModule that will be used to update it
  modalQuizQuestion: Question;

  constructor(
    private modalController: ModalController, 
    public alertController: AlertController,
    private learningModuleService: LearningModuleService,
    private toastCtrl: ToastController) { }

  ngOnInit() { 
    //find the current quiz question that we're viewing and create the reference to it
    this.currentLearningModule.moduleQuiz.forEach(question => {
      if (question === this.currentQuizQuestion)
      {
        this.modalQuizQuestion = question;
      }
    });
   }

  dismiss() {
    //update this learning module
    this.updateLearningModule();

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
          this.deleteQuestion(this.currentQuizQuestion.questionText);
        }}
      ]
    });

    await alert.present();
  }

  updateLearningModule()
  {
    this.learningModuleService.updateLearningModule(this.currentLearningModule).then(() => 
    {
      this.showToast('Quiz question updated!');
    });
  }

  showToast(msg:string)
  {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
