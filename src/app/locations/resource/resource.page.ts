import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LocationService , Location } from 'src/app/services/location.service';
import {ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.page.html',
  styleUrls: ['./resource.page.scss'],
})



export class ResourcePage implements OnInit {
public locationForm: FormGroup;

  location: Location = {
    title: '',
    content: '',
    latitude: 0,
    longitude: 0,
    street: '',
    phone: '',
    operationMOpen: '',
    operationMClose: '',
    operationTOpen: '',
    operationTClose: '',
    operationWOpen: '',
    operationWClose: '',
    operationThOpen: '',
    operationThClose: '',
    operationFOpen: '',
    operationFClose: '',
    operationSatOpen: '',
    operationSatClose: '',
    operationSunOpen: '',
    operationSunClose: '',
    special: '',
    type: ''
  };

  constructor(private afs: AngularFirestore, private activatedRoute: ActivatedRoute, private locationService: LocationService,
              private toastCtrl: ToastController, private router: Router, private storage: Storage,
              public alertController: AlertController, private formBuilder: FormBuilder) {
                 this.locationForm = this.formBuilder.group({
                   title: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                   content: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                   latitude: ['', Validators.compose([Validators.required, Validators.minLength(1),
                     Validators.pattern('^-?(?:90(?:(?:\\.0{1,24})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,24})?))$')])],
                   longitude: ['', Validators.compose([Validators.required, Validators.minLength(1),
                     Validators.pattern('^(-?(?:1[0-7]|[1-9])?\\d(?:\\.\\d{1,24})?|180(?:\\.0{1,24})?)$')])],
                   street: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
                   phone: ['', Validators.compose([Validators.required, Validators.minLength(1),
                     Validators.pattern('^(\\([0-9][0-9][1-9]\\)[0-9][1-9][0-9]-[1-9][0-9][1-9][0-9])')])],
                   operationMOpen: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationMClose: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationTOpen: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationTClose: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationWOpen: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationWClose: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationThOpen: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationThClose: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationFOpen: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationFClose: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationSatOpen: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationSatClose: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationSunOpen: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
                   operationSunClose: ['', Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9] ?([AaPp][Mm])$')],
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
              //  this.locations = this.locationService.getLocations();
                const id = this.activatedRoute.snapshot.paramMap.get('id');
                if (id) {
                  this.locationService.getLocation(id).subscribe(location => {
                    this.location = location;
                    this.locationForm.patchValue(this.location);
                  });

                  this.location.id = id;
                }



            }

            ionViewWillEnter() {

            }




            updateLocation(locationForm: FormGroup) {

              if (this.locationForm.status == 'VALID') {
                this.location.title = locationForm.value.title;
                this.location.content = locationForm.value.content;
                this.location.latitude = Number(locationForm.value.latitude);
                this.location.longitude = Number(locationForm.value.longitude);
                this.location.street = locationForm.value.street;
                this.location.phone = locationForm.value.phone;
                this.location.operationMOpen = locationForm.value.operationMOpen;
                this.location.operationMClose = locationForm.value.operationMClose;
                this.location.operationTOpen = locationForm.value.operationTOpen;
                this.location.operationTClose = locationForm.value.operationTClose;
                this.location.operationWOpen = locationForm.value.operationWOpen;
                this.location.operationWClose = locationForm.value.operationWClose;
                this.location.operationThOpen = locationForm.value.operationThOpen;
                this.location.operationThClose = locationForm.value.operationThClose;
                this.location.operationFOpen = locationForm.value.operationFOpen;
                this.location.operationFClose = locationForm.value.operationFClose;
                this.location.operationSatOpen = locationForm.value.operationSatOpen;
                this.location.operationSatClose = locationForm.value.operationSatClose;
                this.location.operationSunOpen = locationForm.value.operationSunOpen;
                this.location.operationSunClose = locationForm.value.operationSunClose;
                this.location.special = locationForm.value.special + ' ';
                this.location.type = locationForm.value.type;

                this.locationService.updateLocation(this.location).then(() => {
                    this.showToast('Location Updated!');

                    this.router.navigateByUrl('/locations');
                  }, err => {
                    this.showToast('There was a problem adding your location');
                  });

                this.slientlyUpdateLocation(this.location);
              }


            }

            slientlyUpdateLocation(location) {
              this.locationService.updateLocation(location).then(() => {
                console.log('sliently updated location');

              });
            }

            deleteLocation() {
              this.locationService.deleteLocation(this.location.id);
              this.locationService.deleteLocation(this.location.id).then(() => {
                this.router.navigateByUrl('/locations/resource/');
                this.showToast('Location deleted!');
                this.router.navigate(['/locations']);
              }, err => {
                this.showToast('There was a problem deleting your location.');
              });
            }

            showToast(msg: string) {
              this.toastCtrl.create({
                message: msg,
                duration: 2000
              }).then(toast => toast.present());
            }

            getTime(dateStr) {
              const d = dateStr.split('T')[1];
              let m = d.split(':')[0];
              const n = d.split(':')[1];
              const AMOrPM = m >= 12 ? 'pm' : 'am';
              m = (m % 12) || 12;
              return m + ':' + n + ' ' + AMOrPM;
            }

            async deleteLocationConfirmation() {
              const alert = await this.alertController.create({
                header: 'Delete Location?',
                message: 'Are you sure you want to delete this location?',
                buttons: [
                  {text: 'Cancel'},
                  {text: 'Delete',
                  handler: () => {
                    this.deleteLocation();


                  }}
                ]
              });


              await alert.present();


            }

}
