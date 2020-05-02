/// <reference types="@types/gapi.auth2" />

import { Component, OnInit } from '@angular/core';
import { FireService, Survey } from '../services/fire/fire.service';
import { Observable } from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';

declare var gapi: any;

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

    gapi.load("client:auth2", function() {
      gapi.auth2.init({client_id: "173430196657-73pv7jdl40pdldfqhacq1f96kfrio0ki.apps.googleusercontent.com"});
    });

  }

  authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/cloud-platform"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  loadClient() {
    gapi.client.setApiKey("AIzaSyBuzbsBUVWvgyqvc3hiUrDWLMMSsCf3a0E");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/cloudscheduler/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  execute() {
    return gapi.client.cloudscheduler.projects.locations.jobs.run({
      "name": "projects/techdemofirebase/locations/us-central1/jobs/survey_notification",
      "resource": {}
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
}
