import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { InboxService, Submission } from '../services/inbox.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

  private submissions: Observable<Submission[]>;

  constructor(private inboxService: InboxService, private router: Router, private storage: Storage) {
  }

  ngOnInit() {

    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });
    this.submissions = this.inboxService.getSubmissions();

  }

}
