import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chatroom/chat-service.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
              private http: HttpClient,
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

  // uses http request to call firebase cloud function that deletes all chats set to not visible
  // use for storage purposes and clearing out old chats in log
  async deleteOldChats() {
    const alert = await this.alertController.create({
      header: 'Delete All Chats Not Visible?',
      message: 'This will delete all chats that are currently set to not visible from storage permanently.',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete Messages',
          handler: () => {
            this.http.get('https://us-central1-techdemofirebase.cloudfunctions.net/deleteOldChatMessages')
                .subscribe((response) => {
                  this.showToast('Not visible chats have been deleted.'); }, err => {
                  // this.showToast('An error occurred. Please try again. ');
                }
            );
            // this.showToast('Not visible chats have been deleted.');
          }
        }
      ]
    });
    await alert.present();
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

}
