import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FireService, Survey, Question } from 'src/app/services/fire/fire.service';

@Component({
  selector: 'app-modal-single-choice',
  templateUrl: './modal-single-choice.page.html',
  styleUrls: ['./modal-single-choice.page.scss'],
})
export class ModalSingleChoicePage implements OnInit {
  surveyId: string = null;

  firstType = 'Single Choice';
  
  question: Question = {
    questionText: '',
    choice1: '',
    choice2: '',
    choice3: '',
    choice4: '',
    type: this.firstType
  }

  survey: Survey = {
    title: '',
    questions: [],
  }

  constructor(private navParams: NavParams, 
              private modalController: ModalController,
              private fs: FireService) { }

  ngOnInit() {
    this.surveyId = this.navParams.get('survey_id');
    
    this.fs.getSurvey(this.surveyId).subscribe(survey => {
      this.survey = survey;
    });
  }

  addQuestion(){
    this.fs.updateQuestions(this.surveyId, 
      [
        ...this.survey.questions,
        this.question
      ]);
    }
      

  closeModal(){
    this.modalController.dismiss();
  }

}
