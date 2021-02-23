import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController, AlertController} from '@ionic/angular';
import {FireService, Survey} from '../services/fire/fire.service';
import {Storage} from '@ionic/storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
    selector: 'app-surveys',
    templateUrl: './surveys.page.html',
    styleUrls: ['./surveys.page.scss'],
})

export class SurveysPage implements OnInit {
    public surveyForm: FormGroup;

    // Survey object for new and existing surveys
    survey: Survey = {
        title: '',
        display: '',
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
    };

    constructor(private activatedRoute: ActivatedRoute,
                private fs: FireService,
                private toastCtrl: ToastController,
                private router: Router,
                private storage: Storage,
                public alertController: AlertController,
                private formBuilder: FormBuilder
    ) {
        // Makes sure that the necessary fields are added
        this.surveyForm = this.formBuilder.group({
            title: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            display: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            surveyLink: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            type: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            daysTillRelease: ['', Validators.compose([Validators.pattern('^(0|([1-9][0-9]*,[ ])*[1-9][0-9]*)')])],
            daysBeforeDueDate: ['', Validators.compose([Validators.pattern('^(0|([1-9][0-9]*,[ ])*[1-9][0-9]*)')])],
            daysTillExpire: ['', Validators.compose([Validators.required, Validators.minLength(0),
                Validators.pattern('^(0|[1-9][0-9]*)$')])],
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

    ionViewWillEnter() {
        // gets the id of the survey
        const id = this.activatedRoute.snapshot.paramMap.get('id');

        // if the id exists, meaning that this is an already existing survey, get the corresponding
        // survey and assign it to the Survey object delcared above
        if (id) {
            this.fs.getSurvey(id).subscribe(survey => {
                this.survey = survey;
                this.surveyForm.patchValue(this.survey);
            });

        }
    }


    addSurvey() {
        // if the survey fields are valid, then add the survey in the database using the fs service
        if (this.surveyForm.status === 'VALID') {
            const newData = this.surveyForm.value;

            this.fs.addSurvey(newData).then(() => {
                this.router.navigateByUrl('/survey-list');
                this.showToast('Survey added');
            }, err => {
                this.showToast('There was a problem adding your survey');
            });
        }
    }

    async deleteSurveyConfirmation() {
        // asks the administrator if they are certain that they want to delete the survey
        const alert = await this.alertController.create({
            header: 'Delete Survey?',
            message: 'Are you sure you want to delete this survey?',
            buttons: [
                {text: 'Cancel'},
                {
                    text: 'Delete',
                    handler: () => {
                        this.deleteSurvey();
                    }
                }
            ]
        });

        await alert.present();
    }

    deleteSurvey() {
        // if the administrator confirms, the survey will be deleted using the fs service
        this.fs.deleteSurvey(this.survey.id).then(() => {
            this.router.navigateByUrl('/survey-list');
            this.showToast('Survey deleted');
        }, err => {
            this.showToast('There was a problem deleting your survey');
        });
    }

    updateSurvey() {
        // if the survey fields are valid, then update the survey in the database using the fs service
        if (this.surveyForm.status === 'VALID') {
            // IMPORTANT: need to pass in this surveys's ID when updating
            this.surveyForm.addControl('id', this.formBuilder.control(this.survey.id));

            const newData = this.surveyForm.value;

            this.fs.updateSurvey(newData).then(() => {
                this.showToast('Survey updated');
            }, err => {
                this.showToast('There was a problem updating your survey');
            });
        }
    }

    // presents the alert desired
    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['OK']
        });

        await alert.present();
    }

    // useful information when creating/updating a survey
    displayHelpInfo() {
        this.presentAlert('About Survey Fields',
            '<b>Display Survey During Days After Joining:</b> ' +
            'A comma separated list of the days since joining the app the survey should start being displayed to users. ' +
            ' <br>Example: 5, 10, 15 <br><br>' +
            '<b>Display Survey During Days Before Due Date:</b> ' +
            'A comma separated list of the days before due date the survey should start being displayed to users. ' +
            ' <br>Example: 7, 14, 21 <br><br>' +
            '<b>Days Visible Before Expiration:</b> ' +
            'The number of days after appearing that this survey should expire. <br><br>' +
            '<b>Survey URL:</b> ' +
            'Web URL that will link the the qualtrics survey<br><br>' +
            '<b>Type:</b> ' +
            'The type of survey');
    }

    // displays the message that is desired
    showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }

    // determines if the survey type the administrator chose for this survey is After Joining
    get isAfterJoining() {
        return this.survey.type === 'After Joining';
    }

    // determines if the survey type the administrator chose for this survey is Due Date
    get isDueDate() {
        return this.survey.type === 'Due Date';
    }

    // determines if the survey type the administrator chose for this survey is Inactive
    get isInactive() {
        return this.survey.type === 'Inactive';
    }

    // determines if the survey type the administrator chose for this survey is Emotion
    get isEmotion() {
        return this.survey.type === 'Emotion';
    }

}
