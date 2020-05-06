import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chatroom/chat-service.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-chat-cohort-list',
  templateUrl: './chat-cohort-list.page.html',
  styleUrls: ['./chat-cohort-list.page.scss'],
})
export class ChatCohortListPage implements OnInit {

  public cohorts: any;

  constructor(public chatService: ChatService,
              public router: Router,
              public storage: Storage,
              public alertController: AlertController,
              public toastCtrl: ToastController) {
    this.cohorts = this.chatService.getCohorts();
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
  }



  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
