import { Component, OnInit } from '@angular/core';
import { PregnancyUpdatesService, PregnancyUpdateCard } from '../../services/pregnancy-updates.service';
import { Observable } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.page.html',
  styleUrls: ['./add-update.page.scss'],
})
export class AddUpdatePage implements OnInit {

  pregnancyUpdateCard: PregnancyUpdateCard =
      {
        day: '',
        fileName: '',
        description: '',
        picture: ''
      };

  UploadedFileURL: Observable<string>;
  fileName: string;
  task: Promise<any>;
  uploadedImage: FileList;

  constructor(
      private activatedRoute: ActivatedRoute,
      private pregnancyUpdatesService: PregnancyUpdatesService,
      private router: Router,
      private toastCtrl: ToastController,
      private storage: Storage,
      private AFSStorage: AngularFireStorage,
      private database: AngularFirestore) { }

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
  }

  ionViewWillEnter() {

  }

  async addPregnancyUpdate() {
    this.pregnancyUpdatesService.addPregnancyUpdate(this.pregnancyUpdateCard).then(() => {
      this.router.navigateByUrl('/pregnancy-updates');
      this.showToast('Pregnancy apdate added');
    }, err => {
      this.showToast('There was a problem adding your pregnancy update');
    });
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  async uploadImage(event: FileList) {

    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `PregUpdateImages/${new Date().getTime()}_${file.name}`;
    this.pregnancyUpdateCard.fileName = `${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        this.pregnancyUpdateCard.picture = resp;
        this.addPregnancyUpdate();
      });
    });
  }
}
