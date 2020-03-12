import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FireService, Survey, Question } from '../services/fire/fire.service';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})

export class SurveysPage implements OnInit {

  survey: Survey = {
    title: '',
    surveyLink: '',
    type: '',
    daysTillRelease: '',
    daysBeforeDueDate: '',
    daysTillExpire: 0,
    daysInactive: 0,
    emotionChosen: '',
    pointsWorth: 0
  }

  constructor(private activatedRoute: ActivatedRoute,
              private fs: FireService,
              private toastCtrl: ToastController,
              private router: Router,
              private storage: Storage
  ) { }

  ngOnInit() {

    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);

      } else {
        this.storage.get('type').then((value) => {
          if (value !== 'admin') {
            this.router.navigate(['/login/']);
          }
        });
      }
    });

    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id){
      this.fs.getSurvey(id).subscribe(survey => {
        this.survey = survey;
      });
    }
  }

  addSurvey(){    
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

  updateSurvey(){    
    this.fs.updateSurvey(this.survey).then(() => {
      this.showToast('Survey updated');
    }, err => {
        this.showToast('There was a problem updating your survey');
    });
  }

  chosenType(){
    console.log(this.survey.type);
  }

  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  get isAfterJoining(){
    return this.survey.type === 'After Joining';
  }

  get isDueDate(){
    return this.survey.type === 'Due Date';
  }

  get isInactive(){
    return this.survey.type === 'Inactive';
  }

  get isEmotion(){
    return this.survey.type === 'Emotion';
  }

}
