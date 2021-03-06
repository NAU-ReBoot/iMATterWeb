import { Component, OnInit } from '@angular/core';
import { InboxService, Report} from '../../services/inbox/inbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;


@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {

  report: Report = {
  title: '',
  description: '',
  username: '',
  userID: '',
  timestamp: '',
  type: '',
  operatingSys: '',
  version: '',
    viewed: false
};

  constructor(private afs: AngularFirestore,
              private activatedRoute: ActivatedRoute,
              private inboxService: InboxService,
              private toastCtrl: ToastController,
              private router: Router,
              private storage: Storage,
              public alertController: AlertController) { }

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
      this.inboxService.getReport(id).subscribe(report => {
        this.report = report;
      });
    }
  }

  async deleteReportConfirmation() {

    const alert = await this.alertController.create({
      header: 'Delete submission?',
      message: 'Do you want to delete this report?',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
          this.deleteReport();
          }}
      ]
    });

    await alert.present();
  }

  deleteReport() {
    this.inboxService.deleteReport(this.report.id);
    this.router.navigate(['/inbox/']);
  }

}
