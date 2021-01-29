import { Component, OnInit } from '@angular/core';
import { CreateUserService, User, Provider, Admin } from 'src/app/services/createUsers/create-user.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {ProviderType, SettingsService} from '../services/settings/settings.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})


export class HomePage implements OnInit {

  public addAdminForm: FormGroup;
  public addProviderForm: FormGroup;
  public addUserForm: FormGroup;
  public updateUserForm: FormGroup;

  constructor(private createUserService: CreateUserService,
              private formBuilder: FormBuilder,
              private storage: Storage,
              private router: Router,
              private sService: SettingsService,
              private afs: AngularFirestore,
              private toastCtrl: ToastController,
              private alertController: AlertController) {


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
          '',
        Validators.compose([Validators.required, Validators.minLength(1)]),
      ],
      notes: [
        ''
      ]
    });

    this.addAdminForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      notes: [
          ''
      ]
    });

    this.addUserForm = this.formBuilder.group({
      notes: [
        ''
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
      ],
      notes: [
        '',
        Validators.compose([Validators.nullValidator]),
      ]
    });

  }

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
  codeEntered: false,
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
  codeEntered: false,
  notes: ''
};

  public userView = true;
  public signedUserView = true;
  public emptyUserView = false;
  public providerView = false;
  public adminView = false;
  public codeView = false;
  public showUpdateUser = false;

  public displayAddAdmin = false;
  public displayAddProvider = false;
  public displayAddUser = false;

  public users: Observable<User[]>;
  // allows admin to view those that have not signed up yet
  public emptyUsers: Observable<User[]>;
  public providers: Observable<Provider[]>;
  public admins: Observable<Admin[]>;
  public providerTypes: Observable<any>;

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

  showAddUser() {
    this.displayAddUser = true;
  }

  addUser(addUserForm: FormGroup) {
    this.user.notes =  addUserForm.value.notes;
    this.user.code = HomePage.makeString();
    this.createUserService.addUser(this.user);
    this.codeView = true;
    this.emptyUsers = this.createUserService.getEmptyUsers();
    this.clearUserForm();
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
    let emailEntered;
    if (!this.addProviderForm.valid) {
      console.log(
          'Need to complete the form, current value: ', addProviderForm.value
      );
    } else {
      this.provider.firstName = addProviderForm.value.nameFirst;
      this.provider.lastName = addProviderForm.value.nameLast;
      this.provider.email = addProviderForm.value.email;
      this.provider.dob = addProviderForm.value.dob;
      this.provider.type = 'provider';
      this.provider.providerType =  addProviderForm.value.providerType;
      this.provider.notes =  addProviderForm.value.notes;

      const providerTypeRef = this.afs.firestore.collection('providerTypes').where('type', '==', this.provider.providerType);
      providerTypeRef.get().then((res) => {
        res.forEach(document => {
          this.provider.profilePic = document.get('profilePic');
          this.provider.code = HomePage.makeString();

          this.afs.firestore.collection('admins').where('email', '==', this.provider.email)
              .get().then(snap => {
            if (snap.docs.length > 0) {
              console.log(('taken'));
              this.showToast('Email already assigned to another admin');
              emailEntered = true;
            } else {
              this.afs.firestore.collection('providers').where('email', '==', this.provider.email)
                  .get().then(snapshot => {
                if (snapshot.docs.length > 0) {
                  console.log(('taken'));
                  this.showToast('Email already assigned to another provider');
                  emailEntered = true;
                } else {
                  this.createUserService.addProvider(this.provider);
                  this.codeView = true;
                  this.displayAddProvider = false;
                  this.clearProviderForm();
                }
              });
            }
          });

        });
      });
    }
  }

  deleteProvider(id) {
    this.createUserService.deleteProvider(id);
  }

  showAddAdmin() {
    this.displayAddAdmin = true;
  }

  addAdmin(addAdminForm: FormGroup) {
    let emailEntered;

    if (!addAdminForm.valid) {
      console.log('Need to complete the form', addAdminForm.value);
    } else {

      this.admin.email = addAdminForm.value.email;
      this.admin.type = 'admin';
      this.admin.notes = addAdminForm.value.notes;

      this.admin.code = HomePage.makeString();

      this.afs.firestore.collection('admins').where('email', '==', this.admin.email)
          .get().then(snap => {
        if (snap.docs.length > 0) {
          console.log(('taken'));
          this.showToast('Email already assigned to another admin');
          emailEntered = true;
        } else {
          this.afs.firestore.collection('providers').where('email', '==', this.admin.email)
              .get().then(snapshot => {
            if (snapshot.docs.length > 0) {
              console.log(('taken'));
              this.showToast('Email already assigned to another provider');
              emailEntered = true;
            } else {
              this.createUserService.addAdmin(this.admin);
              this.codeView = true;
              this.displayAddAdmin = false;
              this.clearAdminForm();
            }
          });
        }
      });

    }
  }

  deleteAdmin(id) {
    this.createUserService.deleteAdmin(id);
  }

  clearAllForms() {
    this.addProviderForm.reset();
    this.addAdminForm.reset();
    this.addUserForm.reset();
  }

  clearProviderForm() {
    this.addProviderForm.reset();
  }

  clearAdminForm() {
    this.addAdminForm.reset();
  }

  clearUserForm() {
    this.addUserForm.reset();
  }

  async deleteUserConfirmation(userType, id) {
    const alert = await this.alertController.create({
      header: 'Delete this user?',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
          if (userType === 'provider') {
            this.deleteProvider(id);
          } else if (userType === 'admin') {
            this.deleteAdmin(id);
          } else if (userType === 'empty') {
            this.deleteEmptyUser(id);
          } else {
            this.deleteUser(id);
          }
          }}
      ]
    });

    await alert.present();
  }

/*
  filterUsers(event) {
    console.log('called');
    this.initializeUsers();

    const searchInput = event.target.value;

    if (searchInput) {
      this.thisUserList = this.thisUserList.filter(currentQuestion => {
        return(currentQuestion.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1);
      });
    }
  }*/

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  ionViewDidLeave() {
    this.codeView = false;
    this.displayAddProvider = false;
    this.displayAddAdmin = false;
    this.displayAddUser = false;

    this.clearAllForms();

  }

  showNewUser() {
    this.alertController.create({
      header: 'New User',
      inputs: [
        {
          name: 'newUserNote',
          type: 'text',
          placeholder: 'notes (optional)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Continue',
          handler: (alertData) => {
            console.log(alertData.newUserNote);
            this.user.notes = alertData.newUserNote;
            this.showNewUserCode();
          }
        }
      ]
    }).then(res => {
      console.log(res);
      res.present();
    });
  }

  showNewUserCode() {
    this.user.code = HomePage.makeString();
    this.alertController.create({
      header: 'New user code: ' + this.user.code,
      buttons: [
        {
          text: 'Copy code',
          handler: () => {
            this.copyText(this.user.code);
          }
        }
      ],
      backdropDismiss: true
    }).then(res => {
      console.log(res);
      this.createUserService.addUser(this.user);
      res.present();
    });
  }

  copyText(copyData) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', copyData);
      e.preventDefault();
    });
    document.execCommand('copy');
  }
}


