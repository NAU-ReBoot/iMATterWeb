import { Component, OnInit } from '@angular/core';
import {InboxService, LocationSuggestion} from '../../services/inbox/inbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.page.html',
  styleUrls: ['./suggestion.page.scss'],
})
export class SuggestionPage implements OnInit {

  locationSuggestion: LocationSuggestion = {
    name: '',
    address: '',
    reason: '',
    username: '',
    userID: '',
    timestamp: '',
    type: '',
    viewed: false
  };

  constructor(private afs: AngularFirestore,
              private activatedRoute: ActivatedRoute,
              private inboxService: InboxService,
              private toastCtrl: ToastController,
              private router: Router,
              private storage: Storage,
              public alertController: AlertController) { }

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

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.inboxService.getLocationSuggestion(id).subscribe(locationSuggestion => {
        this.locationSuggestion = locationSuggestion;
      });
    }
  }


  async deleteSuggestionConfirmation() {

    const alert = await this.alertController.create({
      header: 'Delete submission?',
      message: 'Do you want to delete this submission?',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
            this.deleteLocationSuggestion();
          }}
      ]
    });

    await alert.present();
  }


  deleteLocationSuggestion() {
    this.inboxService.deleteLocationSuggestion(this.locationSuggestion.id);
    this.router.navigate(['/inbox/']);
  }


}
