import { Component, OnInit } from '@angular/core';
import { CreateUserService, User, Provider, Admin } from 'src/app/services/create-user.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {ProviderType, SettingsService} from '../services/settings.service';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})


export class HomePage implements OnInit {

  public addAdminForm: FormGroup;
  public addProviderForm: FormGroup;
  private updateUserForm: FormGroup;

  constructor(private createUserService: CreateUserService,
              private formBuilder: FormBuilder,
              private storage: Storage,
              private router: Router,
              private sService: SettingsService,
              private afs: AngularFirestore) {

    this.addProviderForm = this.formBuilder.group({
      nameFirst: [
        '',
        Validators.compose([Validators.required]),
      ],
      nameLast: [
        '',
        Validators.compose([Validators.required]),
      ],
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      dob: [
        '',
        Validators.compose([Validators.required, Validators.pattern('^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\\d\\d$')]),
      ],
      providerType: [
        Validators.compose([Validators.required]),
      ]
    });

    this.addAdminForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ]
    });

    this.updateUserForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.nullValidator, Validators.email]),
      ],
      points: [
        '',
        Validators.compose([Validators.nullValidator]),
      ]
    });

  }

  user: User = {
    code: '',
    username: '',
    email:  '',
    password: '',
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
    daysSinceLogin: 0
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
  providerType: ''
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
};

  private userView = true;
  private signedUserView = true;
  private emptyUserView = false;
  private providerView = false;
  private adminView = false;
  private codeView = false;
  private showUpdateUser = false;

  private displayAddAdmin = false;
  private displayAddProvider = false;

  private users: Observable<User[]>;
  // allows admin to view those that have not signed up yet
  private emptyUsers: Observable<User[]>;
  private providers: Observable<Provider[]>;
  private admins: Observable<Admin[]>;
  private providerTypes: Observable<any>;

  static makeString() {
    const inOptions = 'ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz0123456789';
    let outString = '';
    for (let i = 0; i < 6; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }
    return outString;
  }

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

    this.users = this.createUserService.getUsers();
    this.emptyUsers = this.createUserService.getEmptyUsers();
    this.admins = this.createUserService.getAdmins();
    this.providers = this.createUserService.getProviders();
    this.providerTypes = this.sService.getProviderTypes();
  }

  showUsers() {
    this.userView = true;
    this.providerView = false;
    this.adminView = false;
  }

  showProviders() {
    this.userView = false;
    this.providerView = true;
    this.adminView = false;
    this.displayAddProvider = false;
  }

  showAdmins() {
    this.userView = false;
    this.providerView = false;
    this.adminView = true;
    this.displayAddAdmin = false;
  }


  addUser() {
    this.user.code = HomePage.makeString();
    this.createUserService.addUser(this.user);
    this.codeView = true;
    this.emptyUsers = this.createUserService.getEmptyUsers();
  }

  updateUser(userType, id) {
    this.router.navigate(['/update-user/', userType, id]);
  }

  deleteUser(id) {
    this.createUserService.deleteUser(id);
  }

  deleteEmptyUser(id) {
    this.createUserService.deleteEmptyUser(id);
  }

  showAddProvider() {
    this.displayAddProvider = true;
  }

  addProvider(addProviderForm: FormGroup) {
    if (!this.addProviderForm.valid) {
      console.log(
          'Need to complete the form, current value: ', addProviderForm.value
      );
    } else {
      const email: string = addProviderForm.value.email;
      const nameFirst: string = addProviderForm.value.nameFirst;
      const nameLast: string = addProviderForm.value.nameLast;
      const dob: string = addProviderForm.value.dob;
      const providerType: string = addProviderForm.value.providerType;

      this.provider.firstName = nameFirst;
      this.provider.lastName = nameLast;
      this.provider.email = email;
      this.provider.dob = dob;
      this.provider.type = 'provider';
      this.provider.providerType = providerType;

      const picRef = this.afs.firestore.collection('providerTypes').where('type', '==', this.provider.providerType);
      picRef.get().then((res) => {
        res.forEach(document => {
          this.provider.profilePic = document.get('profilePic');
          this.provider.code = HomePage.makeString();
          this.createUserService.addProvider(this.provider);
        });
      });
      this.codeView = true;
      this.displayAddProvider = false;

      this.clearProviderForm();

    }
  }

  deleteProvider(id) {
    this.createUserService.deleteProvider(id);
  }

  showAddAdmin() {
    this.displayAddAdmin = true;
  }

  addAdmin(addAdminForm: FormGroup) {
    if (!addAdminForm.valid) {
      console.log('Need to complete the form', addAdminForm.value);
    } else {

      this.admin.email = addAdminForm.value.email;
      this.admin.type = 'admin';

      this.admin.code = HomePage.makeString();
      this.createUserService.addAdmin(this.admin);
      this.codeView = true;
      this.displayAddAdmin = false;
      this.clearAdminForm();
    }
  }

  deleteAdmin(id) {
    this.createUserService.deleteAdmin(id);
  }

  logOut(): void {
    this.storage.set('authenticated', 'false');
    this.router.navigateByUrl('login');
  }

  clearProviderForm() {
    this.addProviderForm.reset();
  }

  clearAdminForm() {
    this.addAdminForm.reset();
  }

  checkUserActivity() {

  }

  ionViewDidLeave() {
    this.codeView = false;
    this.displayAddProvider = false;
    this.displayAddAdmin = false;

    this.clearProviderForm();
    this.clearAdminForm();

  }

}
