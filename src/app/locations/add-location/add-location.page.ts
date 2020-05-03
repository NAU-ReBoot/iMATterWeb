import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LocationService , Location } from 'src/app/services/location.service';
import {ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public locationForm: FormGroup;

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
              public toastCtrl: ToastController, public router: Router, public storage: Storage,
              private formBuilder: FormBuilder)
              {
                this.locationForm = this.formBuilder.group({
                  title: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                  content: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                  latitude: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('^-?(?:90(?:(?:\\.0{1,24})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,24})?))$')])],
                  longitude: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('^(-?(?:1[0-7]|[1-9])?\\d(?:\\.\\d{1,24})?|180(?:\\.0{1,24})?)$')])],
                  street: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                  phone: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('^([0-9][0-9][1-9]-[0-9][1-9][0-9]-[1-9][0-9][1-9][0-9])')])],
                  operationMF: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                  operationSaturday: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                  operationSunday: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
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

  }





    submitLocation() {

      if(this.locationForm.status == 'VALID')
      {
        this.location= this.location;

        var newData = this.locationForm.value;


          this.locationService.addLocation(newData).then(() => {
          //  this.router.navigateByUrl('/more');
            this.showToast('Location Added');

            this.router.navigateByUrl('/locations');
          }, err => {
            this.showToast('There was a problem adding your location');
          });

          this.slientlyUpdateLocation(this.location);
      }



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

    });
  }



  async addLocation(locationForm: FormGroup)
  {

  }

}
