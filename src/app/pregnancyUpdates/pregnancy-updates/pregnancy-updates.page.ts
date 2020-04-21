import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {PregnancyUpdateCard, PregnancyUpdatesService} from '../../services/pregnancyUpdates/pregnancy-updates.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-pregnancy-updates',
  templateUrl: './pregnancy-updates.page.html',
  styleUrls: ['./pregnancy-updates.page.scss'],
})
export class PregnancyUpdatesPage implements OnInit {
  public pregnancyUpdates: Observable<PregnancyUpdateCard[]>;

  constructor(public pregUpdateService: PregnancyUpdatesService,
              public router: Router,
              public storage: Storage) {
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

    this.pregnancyUpdates = this.pregUpdateService.getAllPregnancyUpdates();
  }
}
