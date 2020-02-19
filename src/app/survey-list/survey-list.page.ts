import { Component, OnInit } from '@angular/core';
import { FireService, Survey } from '../services/fire/fire.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.page.html',
  styleUrls: ['./survey-list.page.scss'],
})
export class SurveyListPage implements OnInit {
  private surveys: Observable<Survey[]>;

  constructor(private fs: FireService) { }

  ngOnInit() {
    this.surveys = this.fs.getSurveys();
  }

}
