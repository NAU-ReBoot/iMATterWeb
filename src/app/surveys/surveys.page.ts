import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { FireService, Survey, Question } from '../services/fire/fire.service';
import {Storage} from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})

export class SurveysPage implements OnInit {
  public surveyForm: FormGroup;

  survey: Survey = {
    title: '',
    surveyLink: '',
    type: '',
    daysTillRelease: '',
    daysBeforeDueDate: '',
    daysTillExpire: 0,
    daysInactive: 0,
    emotionChosen: '',
    pointsWorth: 0,
    userVisibility: [],
    surveyDescription: '',
  }

  constructor(private activatedRoute: ActivatedRoute,
              private fs: FireService,
              private toastCtrl: ToastController,
              private router: Router,
              private storage: Storage,
              public alertController: AlertController,
              private formBuilder: FormBuilder
  ) { 
    this.surveyForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      surveyLink: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      type: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      daysTillRelease: [''],
      daysBeforeDueDate: [''],
      daysTillExpire: [''],
      daysInactive: [''],
      emotionChosen: [''],
      pointsWorth: [''],
      userVisibility: [''],
      surveyDescription: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
  }

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
  }

  ionViewWillEnter(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id){
      this.fs.getSurvey(id).subscribe(survey => {
        this.survey = survey;
        this.surveyForm.patchValue(this.survey);
      });
 
    }
  }
  

  addSurvey(){    
    if(this.surveyForm.status === 'VALID'){
      var newData = this.surveyForm.value;

      this.fs.addSurvey(newData).then(() => {
        this.router.navigateByUrl('/survey-list');
        this.showToast('Survey added');
      }, err => {
          this.showToast('There was a problem adding your survey');
      });
    }
  }

  async deleteSurveyConfirmation(){
    const alert = await this.alertController.create({
      header: 'Delete Survey?',
      message: 'Are you sure you want to delete this survey?',
      buttons: [
        {text: 'Cancel'}, 
        {text: 'Delete',
        handler: () => {
          this.deleteSurvey();
        }}
      ]
    });

    await alert.present();
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
    if (this.surveyForm.status == 'VALID')
    { 
      //IMPORTANT: need to pass in this LM's ID when updating
      this.surveyForm.addControl('id', this.formBuilder.control(this.survey.id));

      var newData = this.surveyForm.value;

      this.fs.updateSurvey(newData).then(() => 
      {
        this.showToast('Survey updated');
      }, err => {
          this.showToast('There was a problem updating your survey');
      });
    }
  }

  chosenType(){
    console.log(this.survey.type);
  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
          header,
          message,
          buttons: ['OK']
      });

    await alert.present();
  }
  displayHelpInfo()
  {
    this.presentAlert('About Survey Fields',
    '<b>Display Survey During days After Joining:</b> ' +
      'A comma separated list of the days since joining the app the survey should start being displayed to users. ' +
        ' <br>Example: 5, 10, 15 <br><br>' + 
    '<b>Display Survey During days Before Due Date:</b> ' +
      'A comma separated list of the days before due date the survey should start being displayed to users. ' +
        ' <br>Example: 7, 14, 21 <br><br>' + 
    '<b>Days Visible Before Expiration:</b> ' + 
      'The number of days after appearing that this survey should expire. <br><br>' +
    '<b>Survey URL:</b> ' +
      'Web URL that will link the the qualtrics survey<br><br>' +
    '<b>Type:</b> ' +
      'The type of survey');
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
