import { Component, OnInit } from '@angular/core';
import { LearningModuleService, LearningModule, Question } from '../../services/learning-module.service';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz-modal',
  templateUrl: './quiz-modal.page.html',
  styleUrls: ['./quiz-modal.page.scss'],
})
export class QuizModalPage implements OnInit {

  quizForm: FormGroup;
  learningModuleForm: FormGroup;

  //These come from the componentProps that was passed into this modal from learning-module.content.page
  //They needed to be declared before use
  currentLearningModule: LearningModule;
  currentQuizQuestion: Question;

  //The reference to the quiz question within the currentLearningModule that will be used to update it
  modalQuizQuestion: Question;

  indexOfQuestion: number;

  constructor(
    private modalController: ModalController, 
    public alertController: AlertController,
    private learningModuleService: LearningModuleService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder) 
    {
      this.learningModuleForm = this.formBuilder.group({
      moduleTitle: [''],
      moduleDescription: [''],
      moduleVisibilityTime: [''],
      moduleExpiration: [''],
      moduleContent: [''],
      moduleVideoID: [''],
      modulePPTurl: [''],
      moduleNext: [''],
      moduleQuiz: this.formBuilder.group({
        questionText: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        pointsWorth: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('[0-9]+([0-9]+)*')])],
        choice1: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        choice2: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        choice3: [''],
        choice4: [''],
        correctAnswer: ['', Validators.compose([Validators.required])],
      }),
      modulePointsWorth: [''],
      moduleActive: [''],
      id: []
    });

      /*this.quizForm = this.formBuilder.group({
        questionText: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        pointsWorth: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('[0-9]+([0-9]+)*')])],
        choice1: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        choice2: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        choice3: [''],
        choice4: [''],
        correctAnswer: ['', Validators.compose([Validators.required])],
      });*/
    }

  ngOnInit() { 
    //find the current quiz question that we're viewing and create the reference to it
    /*for (var index = 0; index < this.currentLearningModule.moduleQuiz.length; index++)
    {
      if (this.currentLearningModule.moduleQuiz[index] === this.currentQuizQuestion)
      {
        this.indexOfQuestion = index;

        console.log("INDEX: " + index);
        console.log(this.currentLearningModule.moduleQuiz[index]);
        this.modalQuizQuestion = this.currentLearningModule.moduleQuiz[index];

        this.learningModuleForm.patchValue(this.currentLearningModule);
        this.learningModuleForm.patchValue({moduleQuiz: this.modalQuizQuestion});
        
        console.log(this.currentLearningModule.moduleQuiz);
      }
    }*/

    /*this.currentLearningModule.moduleQuiz.forEach(question => {

      if (question === this.currentQuizQuestion)
      {
        this.modalQuizQuestion = question;
        this.learningModuleForm.patchValue(this.currentLearningModule);
        this.learningModuleForm.patchValue({moduleQuiz: this.modalQuizQuestion});
        console.log(this.currentLearningModule.moduleQuiz);
        console.log(this.modalQuizQuestion);
        //this.learningModuleForm.patchValue(this.modalQuizQuestion);
      }
    });*/

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
    /*var arrayOfQuestions = [];

    if (this.learningModuleForm.status == 'VALID')
    {
      for (var index = this.currentLearningModule.moduleQuiz.length-1; index >= 0; index--)
      {
        if (index != this.indexOfQuestion)
        {
          arrayOfQuestions.push(this.currentLearningModule.moduleQuiz[index]);
        }
        else if (index === this.indexOfQuestion)
        {
          arrayOfQuestions.push(this.learningModuleForm.);
        }
      }

      console.log(arrayOfQuestions);

      this.learningModuleForm.patchValue({moduleQuiz: arrayOfQuestions});

      console.log(this.learningModuleForm.value);

      this.learningModuleService.updateLearningModule(this.learningModuleForm.value).then(() => 
      {
        this.showToast('Quiz question updated!');
      });
    }*/

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
