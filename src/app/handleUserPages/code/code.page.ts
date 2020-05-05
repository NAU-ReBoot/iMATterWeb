import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import { AuthServiceProvider } from '../../services/user/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-code',
  templateUrl: './code.page.html',
  styleUrls: ['./code.page.scss'],
})
export class CodePage implements OnInit {
  public codeForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  public code: any;
  public codeValidated: boolean;

  constructor(
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      private authService: AuthServiceProvider,
      private router: Router,
      private formBuilder: FormBuilder,
      public afs: AngularFirestore,
      private storage: Storage,
      private toastCtrl: ToastController
  ) {
    this.codeForm = this.formBuilder.group({
      code: ['',
        Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
  }

  validateCode(code: string) {
    let docRef = this.afs.firestore.collection('admins').doc(code);
    docRef.get().then((docData) => {
      if (docData.exists && docData.get('codeEntered') === false) {
        console.log('Exists');
        this.codeValidated = true;
        this.setCodeToEntered(code, 'admins');
        this.storage.set('userType', 'admin');
        this.router.navigate(['/signup/', code ]);
        this.codeForm.reset();
      } else if (docData.get('codeEntered') === true) {
        this.showToast('Code already used');
        this.codeValidated = false;
      }
        else {
        docRef = this.afs.firestore.collection('providers').doc(code);
        docRef.get().then((doc) => {
          if (doc.exists && docData.get('codeEntered') === false) {
            console.log('Exists');
            this.codeValidated = true;
            this.setCodeToEntered(code, 'providers');
            this.storage.set('userType', 'provider');
            this.router.navigate(['/signup/', code]);
            this.codeForm.reset();
          } else if (docData.get('codeEntered') === true) {
            this.showToast('Code already used');
            this.codeValidated = false;
          }
            else {
            console.log('No such document!');
            this.codeValidated = false;
          }
        });
      }
    }).catch((err) => {
      console.log('Error getting document', err);
    });
  }

  setCodeToEntered(doc, type) {
    this.afs.firestore.collection(type).doc(doc).update({codeEntered: true});
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}

