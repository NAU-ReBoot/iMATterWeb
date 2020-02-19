import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthServiceProvider } from '../../services/user/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import {ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Admin, Provider } from '../../services/create-user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public loginForm: FormGroup;
    public loading: HTMLIonLoadingElement;
    private email: string;
    private password: string;
    private userID: string;
    private userEmail: boolean;
    private userPassword: string;

    constructor(
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private authService: AuthServiceProvider,
        private router: Router,
        private formBuilder: FormBuilder,
        public afs: AngularFirestore,
        private toastCtrl: ToastController,
        private storage: Storage
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['',
                Validators.compose([Validators.required, Validators.email])],
            password: [
                '',
                Validators.compose([Validators.required, Validators.minLength(6)]),
            ],
        });
    }

    ngOnInit() {
        this.storage.set('authenticated', 'false');
    }

    validateUser(loginForm: FormGroup) {
        this.email = loginForm.value.email;
        this.password = loginForm.value.password;

        let ref = this.afs.firestore.collection('admins');
        ref.where('email', '==', this.email)
            .get().then(snapshot => {
            if (snapshot.docs.length > 0) {
                console.log(('exists'));
                this.userEmail = true;
                const userRef = ref.where('email', '==', this.email);
                userRef.get().then((result) => {
                    result.forEach(doc => {
                        this.userID = doc.id;
                        this.userPassword = doc.get('password');
                        console.log(this.userPassword);

                        if ( this.userPassword === this.password) {
                            this.storage.set('userCode', this.userID);
                            this.storage.set('username', doc.get('username'));
                            this.storage.set('type', doc.get('type'));
                            this.storage.set('authenticated', 'true');

                            this.router.navigate(['/tabs/home/']);
                        } else {
                            this.showToast('Password is incorrect');
                            console.log(this.userPassword);
                            console.log(this.password);
                        }

                    });
                });

            } else {
                ref = this.afs.firestore.collection('providers');
                ref.where('email', '==', this.email)
                    .get().then(snap => {
                    if (snap.docs.length > 0) {
                        console.log(('exists'));
                        this.userEmail = true;
                        const userRef = ref.where('email', '==', this.email);
                        userRef.get().then((result) => {
                            result.forEach(doc => {
                                this.userID = doc.id;
                                this.userPassword = doc.get('password');
                                console.log(this.userPassword);

                                if (this.userPassword === this.password) {
                                    this.storage.set('userCode', this.userID);
                                    this.storage.set('username', doc.get('username'));
                                    this.storage.set('type', doc.get('type'));
                                    this.storage.set('authenticated', 'true');

                                    this.router.navigate(['/provider-home']);
                                } else {
                                    this.showToast('Password is incorrect');
                                }
                            });
                        });
                    } else {
                        this.userEmail = false;
                    }
                });
            }
        });
    }

    showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }
}




/*
    async loginUser(loginForm: FormGroup): Promise<void> {
        if (!loginForm.valid) {
            console.log('Form is not valid yet, current value:', loginForm.value);
        } else {
            this.loading = await this.loadingCtrl.create();
            await this.loading.present();

            const email = loginForm.value.email;
            const password = loginForm.value.password;

            this.authService.loginUser(email, password).then(
                () => {
                    this.loading.dismiss().then(() => {
                        this.router.navigateByUrl('tabs/home');
                    });
                },
                error => {
                    this.loading.dismiss().then(async () => {
                        const alert = await this.alertCtrl.create({
                            message: error.message,
                            buttons: [{ text: 'Ok', role: 'cancel' }],
                        });
                        await alert.present();
                    });
                }
            );
        }
    }*/
