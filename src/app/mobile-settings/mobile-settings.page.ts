/// <reference types="@types/gapi.auth2" />

import { Component, OnInit } from '@angular/core';
import { SettingsService, GiftCardType, ProviderType, mobileNotificationSetting } from '../services/settings/settings.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, Scheduler } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

declare var gapi: any;
@Component({
  selector: 'app-mobile-settings',
  templateUrl: './mobile-settings.page.html',
  styleUrls: ['./mobile-settings.page.scss'],
})
export class MobileSettingsPage implements OnInit {

  learningModuleOne: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }

  learningModuleTwo: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }

  surveyOne: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }

  surveyTwo: mobileNotificationSetting = 
  {
    active: null,
    hour: 0,
    timeOfDay: ''
  }

  constructor(public msService: SettingsService,
              public storage: Storage,
              public router: Router,
              public alertController: AlertController,
              public AFSStorage: AngularFireStorage,
              ) { }

  providerType: ProviderType = {
    type: '',
    profilePic: ''
  };

  // mobile notification settings
  public LMNotifTime: string; //learning module
  public SurveyNotifTime;

  // from db
  public autoProfilePic: string;
  public adminPic: string;
  public profilePics: Array<string>;
  public securityQs: Array<string>;
  public chatLifeSetting: string;
  public chatHoursToLive: number;
  public chatNumberToLive: number;
  public GCEmail: string;
  public typesOfGC: Array<GiftCardType>;
  public pointsToRedeemGC: number;
  public providerTypes: Observable<any>;


  // display booleans
  public displayUserSignUp: boolean;
  public displayChatRoom: boolean;
  public displayGCRedeem: boolean;
  public displayAutoPic: boolean;
  public displayProfilePics: boolean;
  public displaySecurityQs: boolean;
  public displayHoursForChats: boolean;
  public displayNumberForChats: boolean;
  public displayEmailAdmin: boolean;
  public displayTotalPoints: boolean;
  public displayTypesOfGC: boolean;
  public displayUpdateAutoPic: boolean;
  public displayAddProfilePic: boolean;
  public displayProviderSettings: boolean;
  public displayProviderTypes: boolean;
  public displayAddProviderType: boolean;
  public displayAdminSettings: boolean;
  public displayAdminProfilePic: boolean;
  public displayUpdateAdminPic: boolean;
  public displayNotificationSettings: boolean;
  public displayLMNotifSettings: boolean; //learning module
  public displaySurveyNotifSettings: boolean;

  // for uploading image
  UploadedFileURL: Observable<string>;
  fileName: string;
  task: Promise<any>;
  uploadedImage: FileList;
  newImage: boolean;

  public newProviderTypeName: string;
  public newProviderTypeEntered: boolean;

  static getFileName(downloadURL) {
    console.log(downloadURL);
    const fileSplit = downloadURL.split('%2F')[1];
    console.log(fileSplit);
    const filePath = fileSplit.split('?')[0];
    console.log(filePath);
    return filePath;
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
    this.initDisplaysToFalse();

    this.getSecurityQs();
    this.getChatRoomHourSetting();
    this.getPointsToRedeemGC();
    this.getCurrentGCEmail();
    this.getGCTypes();
    this.getAutoProfilePic();
    this.getProfilePics();
    this.providerTypes = this.getProviderTypes();
    this.getAdminPic();
    this.getChatRoomLifeSetting();
    this.getChatRoomNumberSetting();
    this.getMobileNotifSettings();

    gapi.load("client:auth2", function() {
      gapi.auth2.init({client_id: "173430196657-73pv7jdl40pdldfqhacq1f96kfrio0ki.apps.googleusercontent.com"});
    });

  }

  getAutoProfilePic() {
    SettingsService.getUserSignUpSettings().then((result) => {
      this.autoProfilePic = result.get('autoProfilePic');
    });
  }

  getAdminPic() {
    SettingsService.getAdminSettings().then((result) => {
      this.adminPic = result.get('profilePic');
    });
  }

  getProfilePics() {
    SettingsService.getUserSignUpSettings().then((result) => {
      this.profilePics = result.get('profilePictures');
    });
  }

  getSecurityQs() {
    SettingsService.getUserSignUpSettings().then((result) => {
      this.securityQs = result.get('securityQs');
    });
  }

  getChatRoomHourSetting() {
    SettingsService.getChatRoomSettings().then((result) => {
      this.chatHoursToLive = result.get('hours');
    });
  }

  getChatRoomNumberSetting() {
    SettingsService.getChatRoomSettings().then((result) => {
      this.chatNumberToLive = result.get('numberOfChats');
    });
  }

  getChatRoomLifeSetting() {
    SettingsService.getChatRoomSettings().then((result) => {
      this.chatLifeSetting = result.get('lifeType');
      console.log(this.chatLifeSetting);
    });
  }

  getCurrentGCEmail() {
    SettingsService.getGCSettings().then((result) => {
      this.GCEmail = result.get('email');
    });
  }

  getPointsToRedeemGC() {
    SettingsService.getGCSettings().then((result) => {
      this.pointsToRedeemGC = result.get('points');
    });
  }

  getGCTypes() {
    SettingsService.getGCSettings().then((result) => {
      this.typesOfGC = result.get('types');
    });
  }

  getMobileNotifSettings() {
    SettingsService.getMobileNotifSettings().then((result) => {
      this.learningModuleOne = result.get('learningModuleOne');
      this.learningModuleTwo = result.get('learningModuleTwo');
      this.surveyOne = result.get('surveyOne');
      this.surveyTwo = result.get('surveyTwo');
    });
  }

  getProviderTypes() {
    return this.msService.getProviderTypes();
  }

  updateChatLifeSetting(chatLifeSetting) {
    this.msService.updateChatLifeType(chatLifeSetting);
  }

  async updateNumberOfChatsToLive(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newNumber', placeholder: 'New Number of Chats Visible', type: 'number'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updateNumberOfChatsLive(
                data.newNumber
            );
            this.getChatRoomNumberSetting();
          },
        },
      ],
    });
    await alert.present();
  }

  async updateChatHoursToLive(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newHours', placeholder: 'New Hours to Last', type: 'number'},
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
    const filePath = MobileSettingsPage.getFileName(pic);
    this.AFSStorage.ref('ProfileImages').child(filePath).delete();
    this.msService.removeProfilePic(pic);
    this.getProfilePics();
  }

  async addNewProviderType(event: FileList, provider: ProviderType): Promise<void> {
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `ProviderProfileImages/${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        provider.profilePic = resp;
        this.msService.addNewProviderType(provider);
        this.providerType.type = '';
        this.getProfilePics();
      });
    });
  }

  async deleteProviderType(id, pic) {
    const filePath = MobileSettingsPage.getFileName(pic);
    this.AFSStorage.ref('ProviderProfileImages').child(filePath).delete();
    this.msService.removeProviderType(id);
    this.providerTypes = this.getProviderTypes();
  }

  async updateAdminPic(event: FileList, pic): Promise<void> {

    const filePath = MobileSettingsPage.getFileName(pic);
    this.AFSStorage.ref('AdminProfileImage').child(filePath).delete();

    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    this.fileName = file.name;

    // The storage path
    const path = `AdminProfileImage/${new Date().getTime()}_${file.name}`;

    // File reference
    const fileRef = this.AFSStorage.ref(path);

    // The main task
    this.task = this.AFSStorage.upload(path, file).then(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();

      this.UploadedFileURL.subscribe(resp => {
        this.adminPic = resp;
        this.msService.updateAdminPic(resp);
        this.getAdminPic();
      });
    });
  }


  initDisplaysToFalse() {
    this.displayUserSignUp = false;
    this.displayChatRoom = false;
    this.displayGCRedeem = false;
    this.displayAutoPic = false;
    this.displayProfilePics = false;
    this.displaySecurityQs = false;
    this.displayHoursForChats = false;
    this.displayNumberForChats = false;
    this.displayEmailAdmin = false;
    this.displayTotalPoints = false;
    this.displayTypesOfGC = false;
    this.displayProviderSettings = false;
    this.displayProviderTypes = false;
    this.displayAddProviderType = false;
    this.displayAdminSettings = false;
    this.displayAdminProfilePic = false;
    this.displayUpdateAdminPic = false;
    this.displayNotificationSettings = false;
    this.displayLMNotifSettings = false;
    this.displaySurveyNotifSettings = false;
  }

  displaySubCategories(display, displayType) {
    if (displayType === 'userSignUp') 
    {
      this.displayAutoPic = display;
      this.displayProfilePics = display;
      this.displaySecurityQs = display;

    } 
    else if (displayType === 'chatRoom') 
    {
      this.displayHoursForChats = display;
      this.displayNumberForChats = display;

    } 
    else if (displayType === 'giftCard') 
    {
      this.displayEmailAdmin = display;
      this.displayTotalPoints = display;
      this.displayTypesOfGC = display;
    } 
    else if (displayType === 'provider') 
    {
      this.displayProviderTypes = display;
    } 
  }

  ionViewWillLeave() {
    this.initDisplaysToFalse();
  }


//BELOW IS MOBILE NOTIFICATIONS SETTINGS CODE


updateLMNotifSettings()
{
  this.msService.updateMobileNotifications("learningModuleOne", this.learningModuleOne);
  this.msService.updateMobileNotifications("learningModuleTwo", this.learningModuleTwo);

  if (this.learningModuleTwo.active === true)
  {
    
  }
}

updateSurveyNotifSettings()
{
  this.msService.updateMobileNotifications("surveyOne", this.surveyOne);
  this.msService.updateMobileNotifications("surveyTwo", this.surveyTwo);
}

  authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/cloud-platform"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }

  loadClient() {
    gapi.client.setApiKey("YOUR_API_KEY");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/cloudscheduler/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  
  // Updating Learning Module Notifications
  executeLearningModuleNotif() {
    return gapi.client.cloudscheduler.projects.locations.jobs.patch({
      "name": "projects/techdemofirebase/locations/us-central1/jobs/learning_module_notification",
      "updateMask": "schedule",
      "resource": {
        "schedule": "0 8,10 * * *"
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

  // Updating Survey Notifications
  executeSurveyNotif() {
    return gapi.client.cloudscheduler.projects.locations.jobs.patch({
      "name": "projects/techdemofirebase/locations/us-central1/jobs/survey_notification",
      "updateMask": "schedule",
      "resource": {
        "schedule": "0 6 * * *"
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
}

