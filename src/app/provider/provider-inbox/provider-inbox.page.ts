import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {EmotionNotif, ProviderInboxService} from '../../services/provider-inbox.service';

@Component({
  selector: 'app-provider-inbox',
  templateUrl: './provider-inbox.page.html',
  styleUrls: ['./provider-inbox.page.scss'],
})
export class ProviderInboxPage implements OnInit {

  private emotionNotifs: Observable<EmotionNotif[]>;

  constructor(private providerInboxService: ProviderInboxService,
              private storage: Storage,
              private router: Router,
              public alertController: AlertController,
              private AFSStorage: AngularFireStorage) { }

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
