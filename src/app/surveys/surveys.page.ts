import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { FireService, Survey, Question } from '../services/fire/fire.service';
import { ModalSingleChoicePage } from '../modal-single-choice/modal-single-choice.page';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})

export class SurveysPage implements OnInit {

  selectedType = null;

  question: Question = {
    questionText: '',
    choice1: '',
    choice2: '',
    choice3: '',
    choice4: '',
    type: '',
  }

  survey: Survey = {
    title: '',
    questions: [this.question],
  }

  constructor(private activatedRoute: ActivatedRoute,
    private fs: FireService,
    private toastCtrl: ToastController,
    private router: Router, 
    private modalController: ModalController) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id){
      this.fs.getSurvey(id).subscribe(survey => {
        this.survey = survey;
      });
    }
  }

  addSurvey(){
    this.question.type = this.selectedType;
    
    this.fs.addSurvey(this.survey).then(() => {
      this.router.navigateByUrl('/survey-list');
      this.showToast('Survey added');
    }, err => {
        this.showToast('There was a problem adding your survey');
    });
  }

  deleteSurvey(){
    this.fs.deleteSurvey(this.survey.id).then(() => {
      this.router.navigateByUrl('/survey-list');
      this.showToast('Survey deleted');
    }, err => {
        this.showToast('There was a problem deleting your survey');
    });
  }
  
  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  chosenType(){
    console.log(this.selectedType);
  }

  get isSingleChoice(){
    return this.selectedType === 'Single Choice';
  }

  get isMultAnswer(){
    return this.selectedType === 'Multiple Answer';
  }

  get isWordAnswer(){
    return this.selectedType === 'Worded Answer';
  }
  
  async openSingleAnswer(){
    const modal = await this.modalController.create({
      component: ModalSingleChoicePage,
      componentProps: {
        survey_id: this.survey.id,
      }
    });

    return await modal.present();
  }

}
