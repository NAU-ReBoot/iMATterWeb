import { Component, OnInit } from '@angular/core';
import { InboxService, Submission} from '../../services/inbox.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
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

  submission: Submission = {
  title: '',
  description: '',
  username: '',
  userID: '',
  timestamp: '',
  type: '',
};

  constructor(private afs: AngularFirestore, private activatedRoute: ActivatedRoute, private inboxService: InboxService,
              private toastCtrl: ToastController, private router: Router, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.inboxService.getSubmission(id).subscribe(submission => {
        this.submission = submission;
      });
    }
  }

  deleteSubmission() {
    this.inboxService.deleteSubmission(this.submission.id);
    this.router.navigate(['/inbox/']);
  }

}
