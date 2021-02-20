import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LocationService , Location } from 'src/app/services/location.service';
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

  public locations: Observable<Location[]>;


  location: Location = {
    title: '',
    content: '',
    addressType: '',
    latitude: 0,
    longitude: 0,
    street: '',
    phone: '',
    MOpen: '',
    MClose: '',
    TOpen: '',
    TClose: '',
    WOpen: '',
    WClose: '',
    ThOpen: '',
    ThClose: '',
    FOpen: '',
    FClose: '',
    SatOpen: '',
    SatClose: '',
    SunOpen: '',
    SunClose: '',
    special: '',
    type: '',
    hourType: ''
  };

  public clicked = false;
  public forcedNumber: number;
  public secondFrocedNumber: number;

//  public locations: Observable<any>;

constructor(public afs: AngularFirestore, public activatedRoute: ActivatedRoute, public locationService: LocationService,
            public toastCtrl: ToastController, public router: Router, public storage: Storage) { }

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

    this.locations = this.locationService.getLocations();

}

ionViewWillEnter() {

}






}
