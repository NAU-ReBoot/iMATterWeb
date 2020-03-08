import { Component, OnInit } from '@angular/core';
import { MobileSettingsService, GiftCardType } from '../services/mobile-settings.service';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-mobile-settings',
  templateUrl: './mobile-settings.page.html',
  styleUrls: ['./mobile-settings.page.scss'],
})
export class MobileSettingsPage implements OnInit {

  // from db
  private autoProfilePic: string;
  private profilePics: Array<string>;
  private securityQs: Array<string>;
  private chatHoursToLive: number;
  private GCEmail: string;
  private typesOfGC: Array<GiftCardType>;
  private pointsToRedeemGC: number;

  //display booleans
  private displayUserSignUp: boolean;
  private displayChatRoom: boolean;
  private displayGCRedeem: boolean;
  private displayAutoPic: boolean;
  private displayProfilePics: boolean;
  private displaySecurityQs: boolean;
  private displayHoursForChats: boolean;
  private displayEmailAdmin: boolean;
  private displayTotalPoints: boolean;
  private displayTypesOfGC: boolean;
  private displayUpdateAutoPic: boolean;
  private displayAddProfilePic: boolean;

  // for uploading image
  UploadedFileURL: Observable<string>;
  fileName: string;
  task: Promise<any>;
  uploadedImage: FileList;
  newImage: boolean;

  constructor(private msService: MobileSettingsService,
              private storage: Storage,
              private router: Router,
              public alertController: AlertController,
              private AFSStorage: AngularFireStorage,
              ) { }

  ngOnInit() {

    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    this.displayUserSignUp = false;
    this.displayChatRoom = false;
    this.displayGCRedeem = false;
    this.displayAutoPic = false;
    this.displayProfilePics = false;
    this.displaySecurityQs = false;
    this.displayHoursForChats = false;
    this.displayEmailAdmin = false;
    this.displayTotalPoints = false;
    this.displayTypesOfGC = false;

    this.getSecurityQs();
    this.getChatRoomHourSetting();
    this.getPointsToRedeemGC();
    this.getCurrentGCEmail();
    this.getGCTypes();
    this.getAutoProfilePic();
    this.getProfilePics();
  }

  getAutoProfilePic() {
    this.msService.getUserSignUpSettings().then((result) => {
      this.autoProfilePic = result.get('autoProfilePic');
    });
  }

  getProfilePics() {
    this.msService.getUserSignUpSettings().then((result) => {
      this.profilePics = result.get('profilePictures');
    });
  }

  getSecurityQs() {
    this.msService.getUserSignUpSettings().then((result) => {
      this.securityQs = result.get('securityQs');
    });
  }

  getChatRoomHourSetting() {
    this.msService.getChatRoomHourSetting().then((result) => {
      this.chatHoursToLive = result.get('hours');
    });
  }

  getCurrentGCEmail() {
    this.msService.getGCSettings().then((result) => {
      this.GCEmail = result.get('email');
    });
  }

  getPointsToRedeemGC() {
    this.msService.getGCSettings().then((result) => {
      this.pointsToRedeemGC = result.get('points');
    });
  }

  getGCTypes() {
    this.msService.getGCSettings().then((result) => {
      this.typesOfGC = result.get('types');
    });
  }

  async updateChatHoursToLive(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newHours', placeholder: 'New Hours to Last'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updateChatHourstoLive(
                data.newHours
            );
            this.getChatRoomHourSetting();
          },
        },
      ],
    });
    await alert.present();
  }

  async updateGCEmail(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newEmail', placeholder: 'New Email'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updateGCEmail(
                data.newEmail
            );
            this.getCurrentGCEmail();
          },
        },
      ],
    });
    await alert.present();
  }

  async updatePointsToRedeemGC(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newPoints', placeholder: 'New Point Amount', type: 'number'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updatePointsToRedeemGC(
                Number(data.newPoints)
            );
            this.getPointsToRedeemGC();
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteGCType(currentType): Promise<void> {
    this.msService.removeGCType(currentType);
    this.getGCTypes();
  }

  async addGCType(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newType', placeholder: 'New Gift Card Type'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.addGCType(
                data.newType);
            this.getGCTypes();
          },
        },
      ],
    });
    await alert.present();
  }

  async addNewSecurityQ(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newQ', placeholder: 'New Security Question'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.addNewSecurityQ(
                data.newQ);
            this.getSecurityQs();
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteSecurityQ(securityQ): Promise<void> {
    this.msService.removeSecurityQ(securityQ);
    this.getSecurityQs();
  }

  async updateAutoProfilePic(picURL): Promise<void> {
    this.msService.updateAutoProfilePic(picURL);
    this.getAutoProfilePic();
  }

  async addNewProfilePic(event: FileList): Promise<void> {
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `ProfileImages/${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        this.autoProfilePic = resp;
        this.msService.addNewProfilePic(resp);
        this.getProfilePics();
      });
    });
  }

  async deleteProfilePic(pic): Promise<void> {
    const filePath = this.getFileName(pic);
    this.AFSStorage.ref('ProfileImages').child(filePath).delete();
    this.msService.removeProfilePic(pic);
    this.getProfilePics();
  }

  displaySubCategories(display, displayType) {
    if (displayType === 'userSignUp') {
      this.displayAutoPic = display;
      this.displayProfilePics = display;
      this.displaySecurityQs = display;

    } else if (displayType === 'chatRoom') {
      this.displayHoursForChats = display;

    } else if (displayType === 'giftCard') {
      this.displayEmailAdmin = display;
      this.displayTotalPoints = display;
      this.displayTypesOfGC = display;
    }
  }

  getFileName(downloadURL) {
    console.log(downloadURL);
    const fileSplit = downloadURL.split('%2F')[1];
    console.log(fileSplit);
    const filePath = fileSplit.split('?')[0];
    console.log(filePath);
    return filePath;
  }

  ionViewWillLeave() {
    this.displayUserSignUp = false;
    this.displayChatRoom = false;
    this.displayGCRedeem = false;
    this.displayAutoPic = false;
    this.displayProfilePics = false;
    this.displaySecurityQs = false;
    this.displayHoursForChats = false;
    this.displayEmailAdmin = false;
    this.displayTotalPoints = false;
    this.displayTypesOfGC = false;
  }
}

