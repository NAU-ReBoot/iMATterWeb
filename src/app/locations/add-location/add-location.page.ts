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
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit {

  public locations: Observable<Location[]>;

  public clicked = false;
  public opened = false;
  public forcedNumber:number;
  public secondFrocedNumber: number;

  location: Location = {
    title: '',
    content: '',
    latitude: 0,
    longitude: 0,
    street: '',
    phone: '',
    operationMF: '',
    operationSaturday: '',
    operationSunday: '',
    special: '',
    type: ''
  };

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





    submitLocation() {

        this.forcedNumber = 0;

      this.location= this.location;


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
          this.location.special = '  ';
          this.location.type = '';
        }, err => {
          this.showToast('There was a problem adding your location');
        });

        this.slientlyUpdateLocation(this.location);

      }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }


  slientlyUpdateLocation(location)
  {
    this.locationService.updateLocation(this.location).then(()=>
    {
      console.log("sliently updated location");

    })
  }

}
