import { Component, OnInit } from '@angular/core';
import { MobileSettingsService, GiftCardType } from '../services/mobile-settings.service';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-mobile-settings',
  templateUrl: './mobile-settings.page.html',
  styleUrls: ['./mobile-settings.page.scss'],
})
export class MobileSettingsPage implements OnInit {

  private securityQs: Array<string>;
  private chatHoursToLive: number;
  private GCEmail: string;
  private typesOfGC: Array<GiftCardType>;
  private pointsToRedeemGC: number;
  private displayUserSignUp: boolean;
  private displayChatRoom: boolean;
  private displayGCRedeem: boolean;

  constructor(private msService: MobileSettingsService,
              private storage: Storage,
              private router: Router,
              public alertController: AlertController
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


    this.getSecurityQs();
    this.getChatRoomHourSetting();
    this.getPointsToRedeemGC();
    this.getCurrentGCEmail();
    this.getGCTypes();
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

  ionViewWillLeave() {
  this.displayUserSignUp = false;
  this.displayChatRoom = false;
  this.displayGCRedeem = false;
  }
}

