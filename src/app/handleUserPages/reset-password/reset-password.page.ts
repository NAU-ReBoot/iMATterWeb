import { Component, OnInit } from '@angular/core';
import { AuthServiceProvider } from '../../services/user/auth.service';
import { recovery_emailService, Recovery_email } from '../../services/recovery.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public resetPasswordForm: FormGroup;
  public code: number;
  public isAvailable: boolean;
  public checkAvailable: boolean;

  public index: number;
  constructor(
      private authService: AuthServiceProvider,
      private alertCtrl: AlertController,
      private formBuilder: FormBuilder,
      private router: Router,
	  private recovery_emailService: recovery_emailService,
	  public afs: AngularFirestore,
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
    });
	
  }

  ngOnInit() {}

recovery_email: Recovery_email = {
    id: '',
	code: '',
    email: ''
  };

	
 
  addRecovery(){
		this.index = 0;
		this.isAvailable = false;		
		this.code = Math.floor(Math.random() * 1000000000);
		this.recovery_email.code = this.code.toString();
		console.log(this.code);
		this.recovery_email.email = this.resetPasswordForm.value.email;
		console.log(this.recovery_email.email);
		this.recovery_emailService.addRecovery(this.recovery_email);
		this.router.navigateByUrl('recovery-code');
	}

}
