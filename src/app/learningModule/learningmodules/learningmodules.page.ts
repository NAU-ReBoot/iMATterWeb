/// <reference types="@types/gapi.auth2" />

import { Component, OnInit } from '@angular/core';
import { LearningModuleService, LearningModule } from '../../services/learning-module.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

declare var gapi: any;

/**
 * openModal grabs the "new-learning-module-form" and displays it in the modal
 * see new-learning-module-form for functionality regarding adding a new learning module
 */
@Component({
  selector: 'app-learningmodules',
  templateUrl: './learningmodules.page.html',
  styleUrls: ['./learningmodules.page.scss'],
})
export class LearningmodulesPage implements OnInit {
  

  public learningModules: Observable<LearningModule[]>;
  
  constructor(public learningModService: LearningModuleService,
              public router: Router,
              public storage: Storage) { }

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

    this.learningModules = this.learningModService.getAllLearningModules();
    
    gapi.load("client:auth2", function() {
      gapi.auth2.init({client_id: "173430196657-73pv7jdl40pdldfqhacq1f96kfrio0ki.apps.googleusercontent.com"});
    });
  }

   /**
    * These functions call Google Cloud Scheduler API to run learning module notification function immediately
    * Refer to the following link for how this code was obtained
   * https://cloud.google.com/scheduler/docs/reference/rest/v1/projects.locations.jobs
   * /run?apix_params=%7B%22name%22%3A%22projects%2Ftechdemofirebase%2Flocations%2Fus-central1%2Fjobs%2F
   * learning_module_notification%22%2C%22resource%22%3A%7B%7D%7D&apix=true
   */
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
      "name": "projects/techdemofirebase/locations/us-central1/jobs/learning_module_notification",
      "resource": {}
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

}
