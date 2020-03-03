import { Component, OnInit } from '@angular/core';
import { CreateUserService, User, Provider, Admin } from 'src/app/services/create-user.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";

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
              private storage: Storage, private router: Router) {

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
    points: 0
  };

  provider: Provider =  {
  code: '',
  username: '',
  nameFirst: '',
  nameLast: '',
  email: '',
  password: '',
  bio: '',
  dob: '',
  profilePic: '',
  type: ''
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
  private providerView = false;
  private adminView = false;
  private codeView = false;
  private showUpdateUser = false;

  private displayAddAdmin = false;
  private displayAddProvider = false;

  private users: Observable<User[]>;
  private providers: Observable<Provider[]>;
  private admins: Observable<Admin[]>;

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
      }
    });

    this.users = this.createUserService.getUsers();
    this.admins = this.createUserService.getAdmins();
    this.providers = this.createUserService.getProviders();
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
  }

  updateUser(userType, id) {
    this.router.navigate(['/update-user/', userType, id]);
  }

  deleteUser(id) {
    this.createUserService.deleteUser(id);
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

      this.provider.nameFirst = nameFirst;
      this.provider.nameLast = nameLast;
      this.provider.email = email;
      this.provider.dob = dob;
      this.provider.type = 'provider';

      this.provider.code = HomePage.makeString();
      this.createUserService.addProvider(this.provider);
      this.codeView = true;
      this.displayAddProvider = false;
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
      console.log(
          'Need to complete the form, current value: ', addAdminForm.value
      );
    } else {
      const email: string = addAdminForm.value.email;

      this.admin.email = email;
      this.admin.type = 'admin';

      this.admin.code = HomePage.makeString();
      this.createUserService.addAdmin(this.admin);
      this.codeView = true;
      this.displayAddAdmin = false;
    }
  }

  deleteAdmin(id) {
    this.createUserService.deleteAdmin(id);
  }

  logOut(): void {
    this.storage.set('authenticated', 'false');
    this.router.navigateByUrl('login');
  }

}
