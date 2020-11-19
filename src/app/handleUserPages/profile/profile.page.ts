import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProfileService } from '../../services/user/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { Admin } from '../../services/createUsers/create-user.service';

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

  static validateEmail(email) {
    return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  }

  constructor(
      private alertCtrl: AlertController,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private afs: AngularFirestore,
      private storage: Storage,
      public alertController: AlertController,
      private profileService: ProfileService,
      private toastCtrl: ToastController,
  ) { }

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
    console.log(this.admin);
    this.storage.get('userCode').then(async (val) => {
      if (val) {
        // const ref = this.afs.firestore.collection('admins').doc(val);
        // const doc = ref.get();
        // const data = doc.data();

        const userRef = this.afs.firestore.collection('admins').doc(val);
        const userDoc = await userRef.get();
        const data = userDoc.data();
        if (data) {
          this.admin.code = val;
          this.admin.email = data.email;
          this.admin.username = data.username;
          this.admin.password = data.password;
        }

        /*
        ref.get().then(function (doc) {
            const data = doc.data();
            console.log(data['email']);
            this.admin({ email: data['email'] });
        })
        /*
        ref.get().then((result) => {
            console.log(result);
            result.forEach(doc => {

                this.admin.username = doc.get('username');
                this.admin.email = doc.get('email');
                this.admin.password = doc.get('password');
            });
        });
        */
      }
    });
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
            if (ProfilePage.validateEmail(data.newEmail)) {
              console.log(data.newEmail);
              this.profileService.updateEmail(data.newEmail, data.password, this.admin.code,
                  'admins').then(() => {
                    this.showToast('Your email has been updated!');
                    this.getAdminInfo();
                  },
                  err => {
                    this.showToast('There was a problem updating your email. Your password may be incorrect.');
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
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
        { name: 'verifyPassword', placeholder: 'Verify your old password', type: 'password' },
        { name: 'newPassword', placeholder: 'New password - Must be 8 characters', type: 'password', min: 8 },

      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            if (data.oldPassword === data.verifyPassword) {
              if (data.newPassword.length >= 8) {
                this.profileService.updatePassword(data.newPassword, data.oldPassword, data.verifyPassword, this.admin.code,
                    'admins').then(() => {
                      this.showToast('Your password has been updated!');
                      this.getAdminInfo();
                    },
                    err => {
                      this.showToast('There was a problem updating your password. Your password may be incorrect.');
                    });
              } else {
                alert.message = 'Password must be 8 characters or longer';
                return false;
              }
            } else {
              alert.message = 'Your old passwords do not match';
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
