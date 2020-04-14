import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Provider } from '../../services/createUsers/create-user.service';
// import { ProfileService } from '../../services/user/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import {ProfileService} from '../../services/user/profile.service';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.page.html',
  styleUrls: ['./provider-profile.page.scss'],
})
export class ProviderProfilePage implements OnInit {
  provider: Provider =  {
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

  public providerProfileID: any;
  private providerEmail: any;
  private providerPassword: any;

  constructor(
      private alertCtrl: AlertController,
      // private profileService: ProfileService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private afs: AngularFirestore,
      private storage: Storage,
      public alertController: AlertController,
      private profileService: ProfileService
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
    this.storage.get('userCode').then((val) => {
      this.providerProfileID = val;
      if (val) {
        const ref = this.afs.firestore.collection('providers').where('code', '==', val);
        ref.get().then((result) => {
          result.forEach(doc => {
            this.provider.username = doc.get('username');
            this.provider.firstName = doc.get('firstName');
            this.provider.lastName = doc.get('lastName');
            this.provider.email = doc.get('email');
            this.provider.password = doc.get('password');
            this.provider.bio = doc.get('bio');
            this.provider.providerType = doc.get('providerType');
            this.provider.profilePic = doc.get('profilePic');
          });
        });
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
          text: 'Save',
          handler: data => {
            this.profileService
                .updateEmail(data.newEmail, data.password, this.providerProfileID);
            this.provider.email = data.newEmail;
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
                data.oldPassword, this.providerProfileID
            );
            this.refreshPage();
          },
        },
      ],
    });
    await alert.present();
  }

  async updateBio(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newBio', placeholder: 'Your new bio' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateBio(
                data.newBio, this.providerProfileID
            );
            this.refreshPage();
          },
        },
      ],
    });
    await alert.present();
  }

  refreshPage() {
    this.storage.get('userCode').then((val) => {
      this.providerProfileID = val;
      if (val) {
        const ref = this.afs.firestore.collection('providers').where('code', '==', val);
        ref.get().then((result) => {
          result.forEach(doc => {
            this.provider.email = doc.get('email');
            this.provider.password = doc.get('password');
            this.provider.bio = doc.get('bio');
          });
        });
      }
    });
  }

  logOut(): void {
    this.storage.set('authenticated', 'false');
    this.router.navigateByUrl('login');
  }

}
