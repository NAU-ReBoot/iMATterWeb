import {Component, OnInit} from '@angular/core';
import {ChallengeService, Challenge} from '../../services/challenges/challenges.service';
import {FireBaseService} from '../../services/fireBaseService.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { File } from '@ionic-native/file';
import {ref} from 'firebase-functions/lib/providers/database';
import {forEach} from '@angular-devkit/schematics';


@Component({
    selector: 'editChallenge',
    templateUrl: './newChallenge.page.html',
    styleUrls: ['./newChallenge.page.scss'],
})
export class NewChallengePage implements OnInit {
    public challenges: Observable<Challenge[]>;
    public challengesForm: FormGroup;
    public challengeContent: string[];
    public uploadedFileURLs = [];

    challenge: Challenge = {
        title: '',
        description: '',
        type: '',
        length: 0,
        pictures: [],
        contents: []
    };

    constructor(private fs: ChallengeService,
                private fireStorage: AngularFireStorage,
                private storage: Storage,
                private router: Router,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder) {

        this.challengesForm = this.formBuilder.group({
            title: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            description: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            type: ['', Validators.compose([Validators.required])],
            length: ['', Validators.compose([Validators.required])],
            coverPicture: ['']
        });
    }

    ngOnInit() {

    }

    submitChallenge(challengeForm: FormGroup) {
        // this.uploadImage('coverImage');

        this.challenge.title = challengeForm.value.title;
        this.challenge.description = challengeForm.value.description;
        this.challenge.type = challengeForm.value.type;
        this.challenge.length = challengeForm.value.length;
        this.challengeContent.forEach(day => {
            this.addDay(day);
        });
        // console.log(this.uploadedFileURL);
        this.fs.addChallenge(this.challenge).then(() => {
            this.showToast('Challenge Added');
            this.router.navigateByUrl('/challenges');
        });
    }

    uploadFiles() {
        return new Promise((resolve, reject) => {
            this.uploadedFileURLs.forEach(item => {
                item.subscribe(r => {
                    this.challenge.pictures.push(r);
                });
            });
            resolve();
        });
    }

    addDay(day) {
        const dayContents = {
            title: '',
            description: '',
            url: '',
        };

        dayContents.title = (document.getElementById('title' + day) as HTMLInputElement).value;
        dayContents.description = (document.getElementById('desc' + day) as HTMLInputElement).value;
        dayContents.url = (document.getElementById('url' + day) as HTMLInputElement).value;
        this.challenge.contents.push(dayContents);
        console.log(day);
    }

    async uploadImage(id) {
        const file = (document.getElementById(id) as HTMLInputElement).files[0];
        const fileName = file.name;
        console.log('COVER IMAGE: ' + file);

        if (file)  {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                const fileData = e.target.result;
                console.log('FILE DATA: \n' + fileData);
                const filePath = `ChallengeImages/${new Date().getTime()}_${fileName}`;
                const storeRef = this.fireStorage.ref(filePath);
                storeRef.putString(fileData, 'data_url').then((snapshot) => {
                    console.log('Uploaded image!');
                    console.log('URL: ' + storeRef.getDownloadURL());
                    const fileURL = storeRef.getDownloadURL();
                    fileURL.subscribe(resp => {
                        this.challenge.pictures.push(resp);
                    });
                });
            };
            reader.readAsDataURL(file);
            console.log('FILE:\n' + file);
        }
    }

    addContent() {
        const length = (document.getElementById('length') as HTMLInputElement).value;
        const lengthAsNum: number = +length;
        console.log(lengthAsNum);
        this.challengeContent = [];
        for (let i = 1; i <= lengthAsNum; i++) {
            this.challengeContent.push('day' + i);
        }
        console.log(this.challengeContent);
    }

    showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }
}
