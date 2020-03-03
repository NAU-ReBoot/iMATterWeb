import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Admin, CreateUserService, Provider, User} from '../../services/create-user.service';


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

  private userType: string;

  constructor(private router: Router,
              public afs: AngularFirestore,
              private toastCtrl: ToastController,
              private storage: Storage,
              private activatedRoute: ActivatedRoute,
              private createUserService: CreateUserService,) { }

  ngOnInit() {

    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    this.userType = this.activatedRoute.snapshot.paramMap.get('userType');
    console.log(this.userType);
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      if(this.userType === 'user') {
        this.createUserService.getUser(id).subscribe(user => {
          this.user = user;
        });
      } else if(this.userType === 'admin') {
        this.createUserService.getAdmin(id).subscribe(admin => {
          this.admin = admin;
        });
      } else if(this.userType === 'provider') {
        this.createUserService.getProvider(id).subscribe(provider => {
          this.provider = provider;
        });
      }
    }
  }

  updateUser(id) {

  }

}