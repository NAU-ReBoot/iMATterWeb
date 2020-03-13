import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
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
      private storage: Storage
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
      if (docData.exists) {
        console.log('Exists');
        this.codeValidated = true;
        this.storage.set('userType', 'admin');
        this.router.navigate(['/signup/', code ]);
        this.codeForm.reset();
      } else {
        docRef = this.afs.firestore.collection('providers').doc(code);
        docRef.get().then((doc) => {
          if (doc.exists) {
            console.log('Exists');
            this.codeValidated = true;
            this.storage.set('userType', 'provider');
            this.router.navigate(['/signup/', code]);
            this.codeForm.reset();
          } else {
            console.log('No such document!');
            this.codeValidated = false;
          }
        });
      }
    }).catch((err) => {
      console.log('Error getting document', err);
    });
  }
}

