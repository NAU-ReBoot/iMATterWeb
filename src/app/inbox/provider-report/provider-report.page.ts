import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {InboxService, ProviderReport} from '../../services/inbox/inbox.service';
import {AlertController, ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-provider-report',
  templateUrl: './provider-report.page.html',
  styleUrls: ['./provider-report.page.scss'],
})
export class ProviderReportPage implements OnInit {

  providerReport: ProviderReport = {
  provider: '',
  postID: '',
  commentID: '',
  input: '',
  username: '',
  userID: '',
  title: '',
  timestampOfObj: '',
  timestamp: '',
  type: ''
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
      this.inboxService.getProviderReport(id).subscribe(report => {
        this.providerReport = report;
      });
    }
  }

  async deleteProviderReportConfirmation() {

    const alert = await this.alertController.create({
      header: 'Delete Report?',
      message: 'Do you want to delete this report?',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
            this.deleteProviderReport();
          }}
      ]
    });

    await alert.present();
  }

  deleteProviderReport() {
    this.inboxService.deleteProviderReport(this.providerReport.id);
    this.router.navigate(['/inbox/']);
  }

}
