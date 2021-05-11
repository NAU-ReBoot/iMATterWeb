import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService, Location } from 'src/app/services/location.service';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import {forEach} from "@angular-devkit/schematics";

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit {

  public locations: Observable<Location[]>;

  public clicked = false;
  public opened = false;
  public forcedNumber: number;
  public secondFrocedNumber: number;
  public locationForm: FormGroup;

  location: Location = {
    title: '',
    content: '',
    addressType: '',
    latitude: 0,
    longitude: 0,
    street: '',
    phone: '',
    phone24Hour: undefined,
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
    hourType: '',
    url: ''
  };

  constructor(public afs: AngularFirestore, public activatedRoute: ActivatedRoute, public locationService: LocationService,
              public toastCtrl: ToastController, public router: Router, public storage: Storage,
              private formBuilder: FormBuilder) {
    this.locationForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      content: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      addressType: ['', Validators.compose([Validators.required])],
      latitude: ['', Validators.compose([Validators.required, Validators.minLength(1),
      Validators.pattern('^-?(?:90(?:(?:\\.0{1,24})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,24})?))$')])],
      longitude: ['', Validators.compose([Validators.required, Validators.minLength(1),
      Validators.pattern('^(-?(?:1[0-7]|[1-9])?\\d(?:\\.\\d{1,24})?|180(?:\\.0{1,24})?)$')])],
      street: [''],
      hourType: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(1),
      Validators.pattern('^(1?\ ?\\([0-9][0-9][0-9]\\)\ ?[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9])')])],
      phone24Hour: [''],
      MOpen: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      MClose: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      TOpen: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      TClose: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      WOpen: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      WClose: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      ThOpen: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      ThClose: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      FOpen: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      FClose: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      SatOpen: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      SatClose: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      SunOpen: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      SunClose: ['', Validators.pattern('^(([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm]))|[C][L][O][S][E][D]$')],
      url: [''],
      special: [''],
      type: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
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
    this.locations = this.locationService.getLocations();

  }

  ionViewWillEnter() {
    this.locationForm.patchValue(this.location);
  }





  submitLocation(locationForm: FormGroup) {

    if (this.locationForm.status === 'VALID') {
      this.location.title = locationForm.value.title;
      this.location.content = locationForm.value.content;
      this.location.addressType = locationForm.value.addressType;
      this.location.latitude = Number(locationForm.value.latitude);
      this.location.longitude = Number(locationForm.value.longitude);
      if (this.location.addressType === 'physical') {
        this.location.street = locationForm.value.street;
      }
      this.location.phone = locationForm.value.phone;
      this.location.phone24Hour = locationForm.value.phone24Hour;
      this.location.hourType = locationForm.value.hourType;
      if (this.location.hourType === 'specific') {
        this.location.MOpen = this.hoursOfOperation(locationForm.value.MOpen);
        this.location.MClose = this.hoursOfOperation(locationForm.value.MClose);
        this.location.TOpen = this.hoursOfOperation(locationForm.value.TOpen);
        this.location.TClose = this.hoursOfOperation(locationForm.value.TClose);
        this.location.WOpen = this.hoursOfOperation(locationForm.value.WOpen);
        this.location.WClose = this.hoursOfOperation(locationForm.value.WClose);
        this.location.ThOpen = this.hoursOfOperation(locationForm.value.ThOpen);
        this.location.ThClose = this.hoursOfOperation(locationForm.value.ThClose);
        this.location.FOpen = this.hoursOfOperation(locationForm.value.FOpen);
        this.location.FClose = this.hoursOfOperation(locationForm.value.FClose);
        this.location.SatOpen = this.hoursOfOperation(locationForm.value.SatOpen);
        this.location.SatClose = this.hoursOfOperation(locationForm.value.SatClose);
        this.location.SunOpen = this.hoursOfOperation(locationForm.value.SunOpen);
        this.location.SunClose = this.hoursOfOperation(locationForm.value.SunClose);
      }
      this.location.special = locationForm.value.special + ' ';
      this.location.type = locationForm.value.type;
      this.location.url = locationForm.value.url;
      console.log(this.location);

      this.locationService.addLocation(this.location).then(() => {
        this.showToast('Location Added');

        this.router.navigateByUrl('/locations');
      }, err => {
        this.showToast('There was a problem adding your location');
      });

      this.silentlyUpdateLocation(this.location);
    }



  }

  hoursOfOperation(day) {
    if (day === '') {
      return 'CLOSED';
    } else {
      return day;
    }
  }

  copyHours() {
    const mondayOpen = (document.getElementById('MOpen') as HTMLInputElement).value;
    const mondayClose = (document.getElementById('MClose') as HTMLInputElement).value;
    console.log(mondayOpen);
    console.log(mondayClose);
    const weekdays = ['M', 'T', 'W', 'Th', 'F'];
    weekdays.forEach((element) => {
      (document.getElementById(element + 'Open') as HTMLInputElement).value = mondayOpen;
      (document.getElementById(element + 'Close') as HTMLInputElement).value = mondayClose;
    });
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }


  silentlyUpdateLocation(location) {
    this.locationService.updateLocation(this.location).then(() => {
      console.log('silently updated location');

    });
  }

  disableStreet() {
    console.log('Disable street');
    console.log(document.getElementById('streetInput') as HTMLInputElement);
    // (document.getElementById('streetInput') as HTMLInputElement).disabled = true;
    (document.getElementById('streetInput') as HTMLInputElement).classList.add('ion-hide');
    // this.location.callCenter = true;
  }

  enableStreet() {
    // (document.getElementById('streetInput') as HTMLInputElement).disabled = false;
    (document.getElementById('streetInput') as HTMLInputElement).classList.remove('ion-hide');
    // this.location.callCenter = false;
  }

  disableHoursOfOp() {
    console.log(document.getElementsByClassName('hoursOfOp'));
    const hours = document.getElementsByClassName('hoursOfOp');
    Array.from(hours).forEach(value => {
      value.classList.add('ion-hide');
    });
    // this.location.openAllDay = true;
  }

  enableHoursOfOp() {
    console.log(document.getElementsByClassName('hoursOfOp'));
    const hours = document.getElementsByClassName('hoursOfOp');
    Array.from(hours).forEach(value => {
      value.classList.remove('ion-hide');
    });
    // this.location.openAllDay = false;
  }
}
