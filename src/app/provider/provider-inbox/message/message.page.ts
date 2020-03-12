import { Component, OnInit } from '@angular/core';
import { ProviderInboxService, EmotionNotif } from '../../../services/provider-inbox.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {


  emotionNotif: EmotionNotif = {
    userID: '',
    username: '',
    emotionEntered: '',
    viewed: false,
    timestamp: ''
  };

  constructor(private providerInboxService: ProviderInboxService,
              private storage: Storage,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public alertController: AlertController,
              private AFSStorage: AngularFireStorage) { }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.providerInboxService.getEmotionNotif(id).subscribe(emotionNotif => {
        this.emotionNotif = emotionNotif;
      });
    }
  }

}
