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

@Component({
  selector: 'app-resource',
  templateUrl: './resource.page.html',
  styleUrls: ['./resource.page.scss'],
})



export class ResourcePage implements OnInit {


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

  constructor(private afs: AngularFirestore, private activatedRoute: ActivatedRoute, private locationService: LocationService,
              private toastCtrl: ToastController, private router: Router, private storage: Storage,
              public alertController: AlertController) { }

              ngOnInit()
              {
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
                let id = this.activatedRoute.snapshot.paramMap.get('id');
                if (id) {
                  this.locationService.getLocation(id).subscribe(location=> {
                    this.location = location;
                  });

                  this.location.id = id;
                }



            }

            ionViewWillEnter()
            {

            }




            updateLocation()
            {
              this.locationService.updateLocation(this.location).then(() =>
              {
                this.showToast('Location Updated!');
              })
            }

            slientlyUpdateLocation()
            {
              this.locationService.updateLocation(this.location).then(()=>
              {
                console.log("sliently updated location");

              })
            }

            deleteLocation()
            {
              this.locationService.deleteLocation(this.location.id);
              this.locationService.deleteLocation(this.location.id).then(() => {
                this.router.navigateByUrl('/locations/resource/');
                this.showToast('Location deleted!');
              }, err => {
                this.showToast('There was a problem deleting your location.');
              });
            }

            showToast(msg:string)
            {
              this.toastCtrl.create({
                message: msg,
                duration: 2000
              }).then(toast => toast.present());
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
