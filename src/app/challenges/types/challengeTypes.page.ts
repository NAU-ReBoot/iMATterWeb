import {Component, OnInit} from '@angular/core';
import {ChallengeService, Challenge, ChallengeType} from '../../services/challenges/challenges.service';
import {Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage';


@Component({
    selector: 'challenges',
    templateUrl: './challengeTypes.page.html',
    styleUrls: ['./challengeTypes.page.scss'],
})
export class ChallengeTypesPage implements OnInit {
    public categories: Observable<ChallengeType[]>;

    public category = {
        type: '',
        picture: '',
        active: true,
    };
    
   editCategory: ChallengeType = {
       type: '',
       picture: '',
       active: null,
   };

    public fileName: string;
    public task: Promise<any>;
    public uploadedFileURL: Observable<string>;

    constructor(private fs: ChallengeService,
                private storage: Storage,
                private router: Router,
                private toastCtrl: ToastController,
                private fireStorage: AngularFireStorage) {
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
        this.categories = this.fs.getTypes();
        console.log(this.categories);
    }

    logForm() {
        console.log(this.category);
        const file = (document.getElementById('pictureInput') as HTMLInputElement).files[0];
        if (file === undefined) {
            this.showToast('Please submit a picture');
            return;
        }
        this.fileName = file.name;
        // The storage path
        const path = `ChallengeTypeImages/${new Date().getTime()}_${file.name}`;
        // this.ch.fileName = `${new Date().getTime()}_${file.name}`;
        // File reference
        const fileRef = this.fireStorage.ref(path);
        // The main task
        this.task = this.fireStorage.upload(path, file).then(() => {
            // Get uploaded file storage path
            this.uploadedFileURL = fileRef.getDownloadURL();

            this.uploadedFileURL.subscribe(resp => {
                this.category.picture = resp;
                this.category.active = true;
                console.log(this.category);
                this.fs.addChallengeType(this.category).then(() => {
                    this.showToast('Category added');
                });
            });
        });
    }

    activate(id, active) {
        console.log(this.fs.getChallengeType(id));
        if (active) {
            this.fs.deactivateChallengeTypes(id);
        } else {
            this.fs.activateChallengeTypes(id);
        }
    }

    showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }
}
