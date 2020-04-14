import { Component, OnInit } from '@angular/core';
import { AuthServiceProvider } from '../../services/user/auth.service';
import {LoadingController, AlertController, ToastController} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {Admin, Provider } from '../../services/createUsers/create-user.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import 'firebase/storage';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  public signupProviderForm: FormGroup;
  public signupAdminForm: FormGroup;
  public loading: any;
  private id: any;
  private typeAdmin: boolean;
  private allPicURLs: any;
  private picURL: any;
  private showImages: boolean;

  constructor(
      private authService: AuthServiceProvider,
      private storage: Storage,
      private loadingCtrl: LoadingController,
      private alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private afs: AngularFirestore,
      private toastCtrl: ToastController
  ) {

    this.picURL = 'https://firebasestorage.googleapis.com/v0/b/techdemofirebase.appspot.com/o/ProviderProfileImages%2F1453544.png?alt=media&token=fd46b228-4473-4d30-907d-f3209dc1b790';

    this.signupProviderForm = this.formBuilder.group({
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
      username: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(21)]),
      ],
      bio: [
        '',
        Validators.compose([Validators.nullValidator, Validators.maxLength(300)]),
      ],
    });

    this.signupAdminForm = this.formBuilder.group({
      username: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(21)]),
      ],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required]),
      ]
    });
  }

  provider: Provider = {
    code: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: '',
    dob: '',
    profilePic: '',
    type: '',
    providerType: '',
    codeEntered: true,
    notes: ''
  };

  admin: Admin = {
    code: '',
    username: '',
    email: '',
    password: '',
    profilePic: '',
    type: '',
    codeEntered: true,
    notes: ''
  };

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.storage.get('userType').then((val) => {
      if (val) {
        console.log(val)
        if (val === 'admin') {
          this.typeAdmin = true;
        } else {
          this.typeAdmin = false;
        }
      }
    });
  }

  ionViewWillEnter() {
  }

  async signupProvider(signupForm: FormGroup) {
    if (!signupForm.valid) {
      console.log(
          'Need to complete the form, current value: ', signupForm.value
      );
    } else {
      const password: string = signupForm.value.password;
      const username: string = signupForm.value.username;
      const bio: string = signupForm.value.bio;

      this.provider.code = this.id;
      this.provider.username = username;
      this.provider.password = password;
      this.provider.bio = bio;

      this.afs.firestore.collection('providers').where('username', '==', this.provider.username)
          .get().then(snap => {
        if (snap.docs.length > 0) {
          console.log(('taken'));
          this.showToast('Username taken');
        } else {
          const ref = this.afs.firestore.collection('providers').where('code', '==', this.id);
          ref.get().then((result) => {
                result.forEach(doc => {
                  this.provider.email = doc.get('email');
                  this.provider.lastName = doc.get('nameLast');
                  this.provider.firstName = doc.get('nameFirst');
                  this.provider.type = doc.get('type');

                  this.authService.signupProvider(this.provider, password, username, this.provider.email, bio).then(() => {
                    this.loading.dismiss().then(() => {
                      this.storage.set('code', this.provider.code);
                      this.storage.set('type', this.provider.type);

                      this.router.navigate(['/provider-home']);
                    });
                  });
                });
              },
              error => {
            /*
                this.loading.dismiss().then(async () => {
                  const alert = await this.alertCtrl.create({
                    message: error.message,
                    buttons: [{text: 'Ok', role: 'cancel'}],
                  });
                  await alert.present();
                });*/
              }
          );
          // this.loading = await this.loadingCtrl.create();
          // await this.loading.present();
        }
      });
    }
  }

  async signupAdmin(signupForm: FormGroup) {
    if (!signupForm.valid) {
      console.log(
          'Need to complete the form, current value: ', signupForm.value
      );
    } else {
      const password: string = signupForm.value.password;
      const username: string = signupForm.value.username;

      this.admin.code = this.id;
      this.admin.username = username;
      this.admin.password = password;
      this.admin.profilePic = 'https://firebasestorage.googleapis.com/v0/b/techdemofirebase.appspot.com/o/ProviderProfileImages%2F1453544.png?alt=media&token=fd46b228-4473-4d30-907d-f3209dc1b790';

      this.afs.firestore.collection('admins').where('username', '==', this.admin.username)
          .get().then(snap => {
        if (snap.docs.length > 0) {
          console.log(('taken'));
          this.showToast('Username taken');
        } else {

          // retrieve already entered email by admin
          const ref = this.afs.firestore.collection('admins').where('code', '==', this.id);
          ref.get().then((result) => {
                result.forEach(doc => {
                  this.admin.email = doc.get('email');
                  this.admin.type = doc.get('type');

                  this.authService.signupAdmin(this.admin, password, username, this.admin.email).then(() => {
                    this.loading.dismiss().then(() => {
                      this.storage.set('code', this.admin.code);
                      this.storage.set('type', this.admin.type);

                      this.router.navigate(['/tabs/home']);
                    });
                  });
                });
              },
              error => {
            /*
                this.loading.dismiss().then(async () => {
                  const alert = await this.alertCtrl.create({
                    message: error.message,
                    buttons: [{text: 'Ok', role: 'cancel'}],
                  });
                  await alert.present();
                });*/
              }
          );
          // this.loading = await this.loadingCtrl.create();
          // await this.loading.present();
        }
      });
    }
  }

  showPics() {
    this.showImages = true;
  }

  changePic(url: string) {
    this.showImages = false;
    this.picURL = url;
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
