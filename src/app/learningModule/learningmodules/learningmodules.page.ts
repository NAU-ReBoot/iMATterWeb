/// <reference types="@types/gapi.auth2" />

import { Component, OnInit } from '@angular/core';
import { LearningModuleService, LearningModule } from '../../services/learning-module.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

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
  }


   load()
  {
    gapi.load('auth2', this.init);
  }

  init()
  {
    gapi.client.init({
      'clientId': '173430196657-73pv7jdl40pdldfqhacq1f96kfrio0ki.apps.googleusercontent.com',
      'apiKey': 'AIzaSyD2jC2kQSWjqdHGKjteedSKGEtoX7J3e0Q',
      'scope': 'https://www.googleapis.com/auth/cloud-platform',
    }).then(() => {
      return gapi.client.request({
        'path': 'https://cloudscheduler.googleapis.com/v1/projects/techdemofirebase/locations/us-central1/jobs/learning_module_notification:run'
      })
    }).then((response) => {
      console.log(response.result);
    }, (reason) => {
      console.log("error: " + reason.result.error.message);
    });
  }

}
