import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthServiceProvider } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userProfile: any;

  constructor(
      private alertCtrl: AlertController,
      private authService: AuthServiceProvider,
      private profileService: ProfileService,
      private router: Router
  ) {}

  ngOnInit() {
    this.refreshUserProfile();
  }

  logOut(): void {
      this.router.navigateByUrl('login');
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
          text: 'Save',
          handler: data => {
            this.profileService
                .updateEmail(data.newEmail, data.password)
                .then(() => {
                  console.log('Email Changed Successfully');
                })
                .catch(error => {
                  console.log('ERROR: ' + error.message);
                });
          },
        },
      ],
    });
    await alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePassword(
                data.newPassword,
                data.oldPassword
            );
          },
        },
      ],
    });
    await alert.present();
  }

  refreshUserProfile() {
    this.profileService
        .getUserProfile()
        .get()
        .then(userProfileSnapshot => {
          this.userProfile = userProfileSnapshot.data();
        });
  }


}
