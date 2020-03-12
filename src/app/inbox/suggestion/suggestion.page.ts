import { Component, OnInit } from '@angular/core';
import {InboxService, LocationSuggestion} from '../../services/inbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
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
  };

  constructor(private afs: AngularFirestore, private activatedRoute: ActivatedRoute, private inboxService: InboxService,
              private toastCtrl: ToastController, private router: Router, private storage: Storage) { }

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

  deleteLocationSuggestion() {
    this.inboxService.deleteLocationSuggestion(this.locationSuggestion.id);
    this.router.navigate(['/inbox/']);
  }


}
