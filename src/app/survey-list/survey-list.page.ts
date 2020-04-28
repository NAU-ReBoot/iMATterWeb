import { Component, OnInit } from '@angular/core';
import { FireService, Survey } from '../services/fire/fire.service';
import { Observable } from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.page.html',
  styleUrls: ['./survey-list.page.scss'],
})
export class SurveyListPage implements OnInit {
  public surveys: Observable<Survey[]>;

  constructor(private fs: FireService,
              private storage: Storage,
              private router: Router) { }

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

    this.surveys = this.fs.getSurveys();
  }

}
