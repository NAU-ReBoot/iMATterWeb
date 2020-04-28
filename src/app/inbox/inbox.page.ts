import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {InboxService, LocationSuggestion, Submission} from '../services/inbox/inbox.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

  public submissions: Observable<Submission[]>;
  public locationSuggestions: Observable<LocationSuggestion[]>;

  constructor(public inboxService: InboxService, public router: Router, public storage: Storage) {
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
    this.submissions = this.inboxService.getSubmissions();
    this.locationSuggestions = this.inboxService.getLocationSuggestions();

  }

}
