import { Component, OnInit } from '@angular/core';
import { MobileSettingsService } from '../services/mobile-settings.service';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-mobile-settings',
  templateUrl: './mobile-settings.page.html',
  styleUrls: ['./mobile-settings.page.scss'],
})
export class MobileSettingsPage implements OnInit {

  private securityQ1: string;
  private securityQ2: string;
  private securityQ3: string;
  private chatHoursToLive: number;
  private displayUpdateButton: boolean;


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

    this.displayUpdateButton = false;
    this.getSecurityQs();
    this.getChatRoomHourSetting();
  }

  getSecurityQs() {
    this.msService.getSecurityQs().then((result) => {
      this.securityQ1 = result.get('q1');
      this.securityQ2 = result.get('q2');
      this.securityQ3 = result.get('q3');
    });
  }

  getChatRoomHourSetting() {
    this.msService.getChatRoomHourSetting().then((result) => {
      this.chatHoursToLive = result.get('hours');
    });
  }

  showUpdateButton(location) {
    this.displayUpdateButton = true;
  }


  async updateSecurityQuestion(securityQ): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newSecurityQ', placeholder: 'New Security Question'},
      ],
      buttons: [
        { text: 'Cancel' },
        { text: 'Update',
          handler: data => {
            this.msService.updateSecurityQ(
                data.newSecurityQ, securityQ
            );
            this.getSecurityQs();
          },
        },
      ],
    });
    await alert.present();
  }
}
