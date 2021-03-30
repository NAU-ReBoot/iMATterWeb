import {Component, OnInit} from '@angular/core';
import {ChallengeService, Challenge, ChallengeType} from '../../services/challenges/challenges.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {FireBaseService} from '../../services/fireBaseService.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'editChallenge',
    templateUrl: './newChallenge.page.html',
    styleUrls: ['./newChallenge.page.scss'],
})
export class NewChallengePage implements OnInit {
    public challenges: Observable<Challenge[]>;
    public challengeTypes: Observable<ChallengeType[]>;
    public uploadedFileURL: Observable<string>;
    public task: Promise<any>;
    public fileName: string;
    public challengesForm: FormControl;
    public challengeContent: Array<any>;
    public pictures: Array<string>;
    public uploadedImage: FileList;

    challenge: Challenge = {
        title: '',
        description: '',
        type: '',
        length: 0,
        coverPicture: '',
        contents: []
    };

    constructor(private fs: ChallengeService,
                private fireStorage: AngularFireStorage,
                private storage: Storage,
                private router: Router,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private afs: AngularFirestore,
                private activatedRoute: ActivatedRoute,
                private alertController: AlertController) {
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
        this.challengeTypes = this.fs.getTypes();
        console.log(this.challengeTypes);
    }

    ionViewWillEnter() {
        // gets the id of the survey
        const id = this.activatedRoute.snapshot.paramMap.get('id');

        // if the id exists, meaning that this is an already existing survey, get the corresponding
        // survey and assign it to the Survey object delcared above
        if (id) {
            this.fs.getChallenge(id).subscribe(challenge => {
                this.challenge = challenge;
                this.challenge.contents.forEach(task => {
                    task.benefits = task.benefits.join(';');
                    task.tips = task.tips.join(';');
                });
                console.log(this.challenge);
            });

        }
    }

    logForm() {
        console.log(this.challenge);
        if (this.challenge.id) {
            const file = (document.getElementById('pictureInput') as HTMLInputElement).files[0];
            if (file === undefined) {
                this.challenge.contents.forEach(task => {
                    task.benefits = task.benefits.split(';');
                    task.tips = task.tips.split(';');
                });
                console.log(file);
                this.fs.updateChallenge(this.challenge).then(() => {
                    this.showToast('Challenge updated');
                });
                return;
            } else {
                this.fileName = file.name;
                // The storage path
                const path = `ChallengeImages/${new Date().getTime()}_${file.name}`;
                // this.ch.fileName = `${new Date().getTime()}_${file.name}`;
                // File reference
                const fileRef = this.fireStorage.ref(path);
                // The main task
                this.task = this.fireStorage.upload(path, file).then(() => {
                    // Get uploaded file storage path
                    this.uploadedFileURL = fileRef.getDownloadURL();

                    this.uploadedFileURL.subscribe(resp => {
                        this.challenge.coverPicture = resp;
                        this.challenge.contents.forEach(task => {
                            task.benefits = task.benefits.split(';');
                            task.tips = task.tips.split(';');
                        });
                        console.log(this.challenge);
                        this.fs.updateChallenge(this.challenge).then(() => {
                            this.showToast('Challenge updated');
                        });
                    });
                });
            }
        } else {
            const file = (document.getElementById('pictureInput') as HTMLInputElement).files[0];
            if (!file) {
                this.challenge.contents.forEach(task => {
                    task.benefits = task.benefits.split(';');
                    task.tips = task.tips.split(';');
                });
                this.fs.addChallenge(this.challenge).then(() => {
                    this.router.navigateByUrl('/challenges');
                    this.showToast('Challenge added');
                });
                return;
            }
            this.fileName = file.name;
            // The storage path
            const path = `ChallengeImages/${new Date().getTime()}_${file.name}`;
            // this.ch.fileName = `${new Date().getTime()}_${file.name}`;
            // File reference
            const fileRef = this.fireStorage.ref(path);
            // The main task
            this.task = this.fireStorage.upload(path, file).then(() => {
                // Get uploaded file storage path
                this.uploadedFileURL = fileRef.getDownloadURL();

                this.uploadedFileURL.subscribe(resp => {
                    this.challenge.coverPicture = resp;
                    this.challenge.contents.forEach(task => {
                        task.benefits = task.benefits.split(';');
                        task.tips = task.tips.split(';');
                    });
                    console.log(this.challenge);
                    this.fs.addChallenge(this.challenge).then(() => {
                        this.router.navigateByUrl('/challenges');
                        this.showToast('Challenge added');
                    });
                });
            });
        }
    }

    async addChallenge(challengesForm: FormGroup) {
        if (!challengesForm.valid) {
            this.showToast('Incomplete Challenge');
        } else {
            this.fs.addChallenge(this.challenge).then(() => {
                this.router.navigateByUrl('/challenges');
                this.showToast('Challenge added');
                this.challengesForm.reset();
            }, err => {
                this.showToast('There was a problem adding your pregnancy update');
            });
        }
    }

    addContent() {
        const length = (document.getElementById('length') as HTMLInputElement).value;
        const lengthAsNum: number = +length;
        console.log(lengthAsNum);
        this.challengeContent = [];
        for (let i = 1; i <= lengthAsNum; i++) {
            this.challengeContent.push('day' + i);
            this.challenge.contents.push({title: '', activity: '', benefits: '', tips: ''});
        }
        console.log(this.challengeContent);
    }

    async deleteChallengeConfirmation() {
        // asks the administrator if they are certain that they want to delete the survey
        const alert = await this.alertController.create({
            header: 'Delete Survey?',
            message: 'Are you sure you want to delete this survey?',
            buttons: [
                {text: 'Cancel'},
                {
                    text: 'Delete',
                    handler: () => {
                        this.deleteChallenge();
                    }
                }
            ]
        });

        await alert.present();
    }

    deleteChallenge() {
        // if the administrator confirms, the survey will be deleted using the fs service
        this.fs.deleteChallenge(this.challenge.id).then(() => {
            this.router.navigateByUrl('/challenges');
            this.showToast('Challenge deleted');
        }, err => {
            this.showToast('There was a problem deleting your challenge');
        });
    }

    showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }

    // addTip(index) {
    //     this.numTips++;
    //     const tips = document.getElementById('tips');
    //     tips.insertAdjacentHTML('afterend',
    //         '<ion-item><ion-label position="stacked">Tips</ion-label>' +
    //         '<ion-input type="text" name="taskTips' + index + this.numTips +
    //         '" [(ngModel)]="challenge.contents[' + index + '].tips[' + this.numTips + ']"></ion-input></ion-item>');
    // }
}
