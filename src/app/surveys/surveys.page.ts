import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FireService, Survey, Question } from '../services/fire/fire.service';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})

export class SurveysPage implements OnInit {

  survey: Survey = {
    title: '',
    daysTillRelease: 0,
    surveyLink: ''
  };

  constructor(private activatedRoute: ActivatedRoute,
              private fs: FireService,
              private toastCtrl: ToastController,
              private router: Router
  ) { }

  ngOnInit() {
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

  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }


}
