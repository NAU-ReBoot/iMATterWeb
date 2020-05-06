import { Component, OnInit } from '@angular/core';
import {PregnancyUpdateCard, PregnancyUpdatesService} from '../../services/pregnancyUpdates/pregnancy-updates.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';
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

  public UploadedFileURL: Observable<string>;
  public fileName: string;
  public task: Promise<any>;
  public uploadedImage: FileList;
  public pregnancyUpdateForm: FormGroup;
  newImage: boolean;

  constructor(
      public activatedRoute: ActivatedRoute,
      public pregnancyUpdatesService: PregnancyUpdatesService,
      public router: Router,
      public toastCtrl: ToastController,
      public storage: Storage,
      public AFSStorage: AngularFireStorage,
      public afs: AngularFirestore,
      public formBuilder: FormBuilder,
      public alertController: AlertController) {

    this.pregnancyUpdateForm = this.formBuilder.group({
      day: [0,
        Validators.compose([Validators.required, Validators.minLength(1),
          Validators.pattern('^([01]?[0-9]?[0-9]|2[0-7][0-9]|28[0])$')])],
      description: ['',
        Validators.compose([Validators.required, Validators.minLength(1)])],
      picture: [],
      fileName: ['']
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
        this.pregnancyUpdateForm.patchValue(this.pregnancyUpdateCard);
      });
      this.pregnancyUpdateCard.id = id;
    }
    this.newImage = false;
  }

  ionViewWillEnter() {


  }

  updatePregnancyUpdate() {
    
    //IMPORTANT: add the ID of this card
    this.pregnancyUpdateForm.addControl('id', this.formBuilder.control(this.pregnancyUpdateCard.id));

    if (this.pregnancyUpdateForm.status == 'VALID') {
      var newData = this.pregnancyUpdateForm.value;

      this.afs.firestore.collection('pregnancyUpdates').where('day', '==', Number(this.pregnancyUpdateForm.value.day))
          .get().then(snap => {
        if (snap.docs.length > 0) {
          this.showToast('An update for this day has already been created!');
        } else {
          this.pregnancyUpdateCard.day = Number(this.pregnancyUpdateForm.value.day);
          this.pregnancyUpdateCard.description = this.pregnancyUpdateForm.value.description;
          this.pregnancyUpdatesService.updatePregnancyUpdate(this.pregnancyUpdateCard).then(() => {
            this.showToast('Pregnancy update has been updated!');
          });
        }
      });
    }
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

  async deletePregnancyUpdateConfirmation() {
    const alert = await this.alertController.create({
      header: 'Delete this pregnancy update?',
      message: 'Are you sure you want to delete this pregnancy update',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
          this.deletePregnancyUpdate();
          }}
      ]
    });

    await alert.present();
  }

}
