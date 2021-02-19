import {Component, OnInit} from '@angular/core';
import {AuthServiceProvider} from '../../services/user/auth.service';
import {RecoveryEmailService, RecoveryEmail} from '../../services/recovery.service';
import {AlertController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
    public resetPasswordForm: FormGroup;
    public code: number;
    public isAvailable: boolean;
    // public checkAvailable: boolean;
    private userEmail: boolean;

    public index: number;
    public recoveryEmail: RecoveryEmail = {
        id: '',
        code: '',
        email: ''
    };

    constructor(
        private authService: AuthServiceProvider,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private router: Router,
        private recoveryEmailService: RecoveryEmailService,
        public afs: AngularFirestore,
        private toastCtrl: ToastController,

    ) {
        this.resetPasswordForm = this.formBuilder.group({
            email: [
                '',
                Validators.compose([Validators.required, Validators.email]),
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

    addRecovery() {

        this.recoveryEmail.email = this.resetPasswordForm.value.email;


        let ref = this.afs.firestore.collection('admins');
        ref.where('email', '==', this.recoveryEmail.email)
            .get().then(snapshot => {
            if (snapshot.docs.length > 0) {
                this.userEmail = true;
                const userRef = ref.where('email', '==', this.recoveryEmail.email);
                userRef.get().then((result) => {
                    result.forEach(doc => {
                        this.index = 0;
                        this.isAvailable = false;
                        this.code = Math.floor(Math.random() * 1000000000);
                        this.recoveryEmail.code = this.code.toString();
                        console.log(this.code);
                        this.recoveryEmail.email = this.resetPasswordForm.value.email;
                        console.log(this.recoveryEmail.email);
                        this.recoveryEmailService.addRecovery(this.recoveryEmail);
                        this.router.navigateByUrl('recovery-code');


                    });
                });

            } else {
                ref = this.afs.firestore.collection('providers');
                ref.where('email', '==', this.recoveryEmail.email)
                    .get().then(snap => {
                    if (snap.docs.length > 0) {
                        console.log(('exists'));
                        this.userEmail = true;
                        const userRef = ref.where('email', '==', this.recoveryEmail.email);
                        userRef.get().then((result) => {
                            result.forEach(doc => {
                                this.index = 0;
                                this.isAvailable = false;
                                this.code = Math.floor(Math.random() * 1000000000);
                                this.recoveryEmail.code = this.code.toString();
                                console.log(this.code);
                                this.recoveryEmail.email = this.resetPasswordForm.value.email;
                                console.log(this.recoveryEmail.email);
                                this.recoveryEmailService.addRecovery(this.recoveryEmail);
                                this.router.navigateByUrl('recovery-code');


                            });
                        });
                        this.showToast("Email sent");
                    } else {
                        this.userEmail = false;
                        this.showToast('Email  is not valid');
                    }
                });
            }
        });


        /*
          this.index = 0;
          this.isAvailable = false;
          this.code = Math.floor(Math.random() * 1000000000);
          this.recoveryEmail.code = this.code.toString();
          console.log(this.code);
          this.recoveryEmail.email = this.resetPasswordForm.value.email;
          console.log(this.recoveryEmail.email);
          this.recoveryEmailService.addRecovery(this.recoveryEmail);
          this.router.navigateByUrl('recovery-code');
          */
    }

}
