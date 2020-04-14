import { Component, OnInit } from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import { AuthServiceProvider } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Storage} from '@ionic/storage';
import {Admin} from '../../services/createUsers/create-user.service';
import {EmailValidator} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

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

  public userProfile: any;

  constructor(
      private alertCtrl: AlertController,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private afs: AngularFirestore,
      private storage: Storage,
      public alertController: AlertController,
      private profileService: ProfileService,
      private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });
    // this.refreshUserProfile();
  }

  ionViewWillEnter() {
    this.getAdminInfo();
  }

  getAdminInfo() {
    this.storage.get('userCode').then((val) => {
      if (val) {
        this.admin.code = val;
        const ref = this.afs.firestore.collection('admins').where('code', '==', val);
        ref.get().then((result) => {
          result.forEach(doc => {
            this.admin.username = doc.get('username');
            this.admin.email = doc.get('email');
            this.admin.password = doc.get('password');
          });
        });
      }
    });
  }

  validateEmail(email) {
    if ( /(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
      return true;
    } else {
      return false;
    }
  }


  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Update',
          handler: data => {
            if (this.validateEmail(data.newEmail)) {
            this.profileService.updateEmail(data.newEmail, data.password, this.admin.code,
                'admins').then(() => {
                  this.showToast('Your email has been updated!');
                  this.getAdminInfo(); },
                err => {this.showToast('There was a problem updating your email');
                });
            } else {
              alert.message = 'Invalid Email';
              return false;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password - Must be 8 characters', type: 'password', min: 8 },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            if (data.newPassword.length >= 8) {
              this.profileService.updatePassword(data.newPassword, data.oldPassword, this.admin.code,
                  'admins').then(() => {
                    this.showToast('Your password has been updated!');
                    this.getAdminInfo();
                  },
                  err => {
                    this.showToast('There was a problem updating your bio');
                  });
            } else {
              alert.message = 'Password must be 8 characters or longer';
              return false;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  logOut(): void {
    this.storage.set('authenticated', 'false');
    this.router.navigateByUrl('login');
  }

}
