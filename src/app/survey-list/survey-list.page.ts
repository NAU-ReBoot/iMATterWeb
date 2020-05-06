/// <reference types="@types/gapi.auth2" />

import { Component, OnInit } from '@angular/core';
import { FireService, Survey } from '../services/fire/fire.service';
import { Observable } from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import { ToastController } from '@ionic/angular';

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
              private router: Router,
              private toastCtrl: ToastController) { }

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
      gapi.auth2.init({client_id: "626066789753-d0jm6t0ape6tnfvomv2ojuvf73glllk5.apps.googleusercontent.com"});
    });

  }

  showToast(msg:string)
  {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/cloud-platform"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  loadClient() {
    gapi.client.setApiKey("AIzaSyAee_ZhwbI6bgXOoRwe_BfkiQAVYMOg4HQ");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/cloudscheduler/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  execute() {
    return gapi.client.cloudscheduler.projects.locations.jobs.run({
      "name": "projects/imatter-nau/locations/us-central1/jobs/survey_notification",
      "resource": {}
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                //this.showToast('Notifications for surveys were successfully sent!');
              },
              function(err) 
              { 
                console.error("Execute error", err); 
                //this.showToast('There was an error sending survey notifications.');
              });
  }
}
