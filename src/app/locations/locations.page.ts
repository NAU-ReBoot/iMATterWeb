import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LocationService , Location } from '../services/location.service';
import {ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {



  location: Location = {
    title: '',
    content: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    operationMF: '',
    operationSaturday: '',
    operationSunday: '',
    special: '',
    type: ''
  };

  constructor(private afs: AngularFirestore, private activatedRoute: ActivatedRoute, private locationService: LocationService,
              private toastCtrl: ToastController, private router: Router, private storage: Storage) { }

  ngOnInit()
  {
    this.storage.get('authenticated').then((val) => {
    if (val === 'false') {
      this.router.navigate(['/login/']);
    }
  });
  }



  submitLocation() {

      this.locationService.addLocation(this.location).then(() => {
      //  this.router.navigateByUrl('/more');
        this.showToast('Location Added');
        this.location.title = '';
        this.location.content = '';
        this.location.phone = '';
        this.location.longitude = 0;
        this.location.latitude = 0;
        this.location.operationMF = '';
        this.location.operationSaturday = '';
        this.location.operationSunday = '';
        this.location.special = '';
        this.location.type = '';
      }, err => {
        this.showToast('There was a problem adding your location');
      });
    }

showToast(msg) {
  this.toastCtrl.create({
    message: msg,
    duration: 2000
  }).then(toast => toast.present());
}




}
