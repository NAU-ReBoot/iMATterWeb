import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Provider } from '../../services/create-user.service';
// import { ProfileService } from '../../services/user/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

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
    providerType: ''
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
      private storage: Storage
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
    this.providerProfileID = this.storage.get('userCode');
    this.storage.get('userCode').then((val) => {
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

  logOut(): void {
    this.storage.set('authenticated', 'false');
    this.router.navigateByUrl('login');
  }

}
