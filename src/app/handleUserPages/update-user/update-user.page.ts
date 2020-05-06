import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Admin, CreateUserService, Provider, User} from '../../services/createUsers/create-user.service';
import {ProviderType, SettingsService} from '../../services/settings/settings.service';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {

  user: User = {
    code: '',
    username: '',
    email:  '',
    dueMonth: '',
    weeksPregnant: 0,
    location: 0,
    cohort: '',
    profilePic: '',
    securityQ: '',
    securityA: '',
    joined: '',
    currentEmotion: '',
    bio:  '',
    points: 0,
    daysSinceLogin: 0,
    codeEntered: true,
    notes: ''
  };

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

  providerType: ProviderType = {
    type: '',
    profilePic: ''
  };

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

  public userType: string;
  public providerTypes: Observable<any>;

  constructor(public router: Router,
              public afs: AngularFirestore,
              public toastCtrl: ToastController,
              public storage: Storage,
              public activatedRoute: ActivatedRoute,
              public createUserService: CreateUserService,
              private sService: SettingsService,
              ) { }

  ngOnInit() {

    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);

      } else {
        this.storage.get('type').then((value) => {
          if (value !== 'admin') {
            this.router.navigate(['/login/']);
          }
        });
      }
    });

    this.userType = this.activatedRoute.snapshot.paramMap.get('userType');
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      if (this.userType === 'user') {
        this.createUserService.getUser(id).subscribe(user => {
          this.user = user;
        });
      } else if (this.userType === 'admin') {
        this.createUserService.getAdmin(id).subscribe(admin => {
          this.admin = admin;
        });
      } else if (this.userType === 'provider') {
        this.createUserService.getProvider(id).subscribe(provider => {
          this.provider = provider;
          this.providerTypes = this.sService.getProviderTypes();
        });
      }
    }
  }

  updateUser(id) {
    this.createUserService.updateUser(id, this.user).then(() => {
      this.showToast('User updated');
    });
  }

  updateProvider(id) {
    this.createUserService.updateProvider(id, this.provider).then(() => {
      this.showToast('Provider updated');
    });
  }

  updateAdmin(id) {
    this.createUserService.updateAdmin(id, this.admin).then(() => {
      this.showToast('Admin updated');
    });
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
