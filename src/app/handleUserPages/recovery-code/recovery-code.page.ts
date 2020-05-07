import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthServiceProvider} from '../../services/user/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import {ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProfileService } from '../../services/user/profile.service';

@Component({
  selector: 'app-recovery-code',
  templateUrl: './recovery-code.page.html',
  styleUrls: ['./recovery-code.page.scss'],
})
export class RecoveryCodePage implements OnInit {
	public loginForm: FormGroup;
    public loading: HTMLIonLoadingElement;
    public email: string;
    public password: string;
    public userID: string;
    public userEmail: boolean;
    public userPassword: string;
	public recoveryCode: string;
	public theCode: string;
	public wantedUserID: string;
	public recoveryPassword: string;
	public isProvider: boolean;
	
	

  public enterCodeForm: FormGroup;
  constructor(
      public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public authService: AuthServiceProvider,
        public router: Router,
        public formBuilder: FormBuilder,
        public afs: AngularFirestore,
        public toastCtrl: ToastController,
        public storage: Storage,
		public profileService: ProfileService
  ) {
    this.enterCodeForm = this.formBuilder.group({
      recoveryCode: [
        '',
        Validators.compose([Validators.required]),
      ],
	  recoveryPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
  }

  ngOnInit() {
  }
  
  showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }
  
  validateUser(enterCodeForm: FormGroup) {
        this.recoveryCode = enterCodeForm.value.recoveryCode;
		this.recoveryPassword = enterCodeForm.value.recoveryPassword;
		
        var recoveryEmail;
		var theCode;
		console.log("1");
		console.log(this.recoveryCode);
		console.log("recoveryEmail");
		console.log(this.recoveryPassword.toString());
		//const newPassword: string = this.recoveryPassword;
		let newPassword = this.enterCodeForm.controls['recoveryPassword'].value;
		console.log(newPassword);
		
		//currently provider_recovery_email contains both admin and provider recovery, will change variable name for clarifaction in the future
        this.afs.firestore.collection('provider_recovery_email').where('code', '==', this.recoveryCode)
            .get().then(snapshot => {
            if (snapshot.docs.length > 0) {
                console.log(('exists'));
				const recoveryRef = this.afs.firestore.collection('provider_recovery_email');
				recoveryRef.get().then((result) => {
                    result.forEach(doc => {
                        this.userID = doc.id;
                        this.theCode = doc.get('code');						
                        if ( this.theCode === this.recoveryCode) {
                            recoveryEmail = doc.get('email');
							this.afs.firestore.collection('provider_recovery_email').doc(doc.id).update({
								code: "",
								email: ""
							});
							console.log(recoveryEmail);
							console.log("5");                                                    
                        } else {                            
                        }
                    });
                });				
				
                const userRef = this.afs.firestore.collection('providers');
				
                userRef.get().then((result) => {
                    result.forEach(doc => {
                        this.userID = doc.id;
                        this.userEmail = doc.get('email');
						this.password = doc.get('password');
						//console.log(this.userID);
                        if ( this.userEmail === recoveryEmail) {                            							
							this.wantedUserID = this.userID;
							
							console.log(this.userID);
							this.afs.firestore.collection('providers').doc(this.wantedUserID).update({
								password: newPassword
							});
							this.isProvider = true;
							if(this.isProvider == true){
								this.router.navigate(['/login/']);
							}
                        } else {                           
                        }
                    });
                });				
            } else {
                console.log('Email does not exist');
                this.userEmail = false;
            }
        });
    
	//currently provider_recovery_email contains both admin and provider recovery, will change variable name for clarifaction in the future
	 this.afs.firestore.collection('provider_recovery_email').where('code', '==', this.recoveryCode)
            .get().then(snapshot => {
            if (snapshot.docs.length > 0 && this.isProvider !=true) {
                console.log(('exists'));
				const recoveryRef = this.afs.firestore.collection('provider_recovery_email');
				recoveryRef.get().then((result) => {
                    result.forEach(doc => {
                        this.userID = doc.id;
                        this.theCode = doc.get('code');						
                        if ( this.theCode === this.recoveryCode) {
                            recoveryEmail = doc.get('email');
							this.afs.firestore.collection('provider_recovery_email').doc(doc.id).update({
								code: "",
								email: ""
							});
							console.log(recoveryEmail);
							console.log("5");                                                    
                        } else {                            
                        }
                    });
                });				
				
                const userRef = this.afs.firestore.collection('admins');
				
                userRef.get().then((result) => {
                    result.forEach(doc => {
                        this.userID = doc.id;
                        this.userEmail = doc.get('email');
						this.password = doc.get('password');
						//console.log(this.userID);
                        if ( this.userEmail === recoveryEmail) {                            							
							this.wantedUserID = this.userID;
							
							console.log(this.userID);
							this.afs.firestore.collection('admins').doc(this.wantedUserID).update({
								password: newPassword
							});
							this.router.navigate(['/login/']);
                        } else {                           
                        }
                    });
                });				
            } else {
				this.showToast('Code invalid')
                console.log('Email does not exist');
                this.userEmail = false;
            }
        });

  }

}
