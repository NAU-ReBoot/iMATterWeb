import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {EmotionNotif, ProviderInboxService} from '../../services/providerInbox/provider-inbox.service';

@Component({
  selector: 'app-provider-inbox',
  templateUrl: './provider-inbox.page.html',
  styleUrls: ['./provider-inbox.page.scss'],
})
export class ProviderInboxPage implements OnInit {

  public emotionNotifs: Observable<EmotionNotif[]>;

  constructor(public providerInboxService: ProviderInboxService,
              public storage: Storage,
              public router: Router,
              public alertController: AlertController,
              public AFSStorage: AngularFireStorage) { }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    this.emotionNotifs = this.providerInboxService.getEmotionNotifs();

  }

  updateToViewed(id) {
    this.providerInboxService.updateNotifAsSeen(id);
  }

}
