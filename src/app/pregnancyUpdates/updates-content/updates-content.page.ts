import { Component, OnInit } from '@angular/core';
import {PregnancyUpdateCard, PregnancyUpdatesService} from '../../services/pregnancy-updates.service';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-updates-content',
  templateUrl: './updates-content.page.html',
  styleUrls: ['./updates-content.page.scss'],
})
export class UpdatesContentPage implements OnInit {

  pregnancyUpdateCard: PregnancyUpdateCard =
      {
        day: 0,
        fileName: '',
        description: '',
        picture: ''
      };

  private UploadedFileURL: Observable<string>;
  private fileName: string;
  private task: Promise<any>;
  private uploadedImage: FileList;
  private pregnancyUpdateForm: FormGroup;
  newImage: boolean;

  constructor(
      private activatedRoute: ActivatedRoute,
      private pregnancyUpdatesService: PregnancyUpdatesService,
      private router: Router,
      private toastCtrl: ToastController,
      private storage: Storage,
      private AFSStorage: AngularFireStorage,
      private database: AngularFirestore,
      private formBuilder: FormBuilder) {

    this.pregnancyUpdateForm = this.formBuilder.group({
      day: [0,
        Validators.compose([Validators.required, Validators.minLength(1),
          Validators.pattern('^([01]?[0-9]?[0-9]|2[0-7][0-9]|28[0])$')])],
      description: ['',
        Validators.compose([Validators.required, Validators.minLength(1)])],
    });
  }


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

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.pregnancyUpdatesService.getPregnancyUpdate(id).subscribe(pregnancyUpdateCard => {
        this.pregnancyUpdateCard = pregnancyUpdateCard;
        this.pregnancyUpdateCard.picture = pregnancyUpdateCard.picture;
      });
      this.pregnancyUpdateCard.id = id;
    }
    this.newImage = false;
  }

  ionViewWillEnter() {

  }

  updatePregnancyUpdate() {
    this.pregnancyUpdatesService.updatePregnancyUpdate(this.pregnancyUpdateCard).then(() => {
      this.showToast('Pregnancy update has been updated!');
    });
  }

  deletePregnancyUpdate() {
    this.AFSStorage.ref('PregUpdateImages').child(this.pregnancyUpdateCard.fileName).delete();
    this.pregnancyUpdatesService.deletePregnancyUpdate(this.pregnancyUpdateCard.id).then(() => {
      this.router.navigateByUrl('/pregnancy-updates');
      this.showToast('Pregnancy update deleted!');
    }, err => {
      this.showToast('There was a problem deleting your pregnancy update');
    });
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  /**
   * This function was written with the help from :
   * https://www.freakyjolly.com/ionic-4-image-upload-with-progress-in-firestore-and-firestorage-tutorial-by-application/
   * Used for storing and accessing the firestore storage for images
   */

  async uploadImage(event: FileList, filePath: string) {
    console.log(filePath);
    this.AFSStorage.ref('PregUpdateImages').child(filePath).delete();
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
        this.updatePregnancyUpdate();
      });
    });
  }
}
