import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ChatService, Cohort, Chat } from '../services/chatroom/chat-service.service';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-chatlog',
  templateUrl: './chatlog.page.html',
  styleUrls: ['./chatlog.page.scss'],
})
export class ChatlogPage implements OnInit {

  cohort: Cohort = {
    name: ''
  };

  chat: Chat = {
    cohort: '',
    username: '',
    userID: '',
    timestamp: '',
    message: '',
    type: '',
    visibility: true
  };

  private cohortChat: string;
  public chats: Observable<any>;
  private showLog: boolean;
  private id: any;
  public chatsList: any[];
  public loadedChats: any[];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private storage: Storage,
              private chatService: ChatService,
              private afs: AngularFirestore,
              public alertController: AlertController) {

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

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.afs.collection('chats',
        ref => ref.where('cohort', '==', this.id).orderBy('timestamp'))
        .valueChanges({ idField: 'id' }).subscribe(chatsList => {
      this.chatsList = chatsList;
      console.log(this.chatsList);
      this.loadedChats = chatsList;
    });
    this.chats = this.chatService.getChats(this.id);
  }

  initializeItems(): void {
    this.chatsList = this.loadedChats;
  }

  filterChats(event) {
    console.log('called');
    this.initializeItems();

    const searchInput = event.target.value;


    if (searchInput) {
      this.chatsList = this.chatsList.filter(currentChat => {
        return(currentChat.message.toLowerCase().indexOf(searchInput.toLowerCase()) > -1);
      });
    }
  }

  deleteChat(chatID) {
    this.chatService.deleteChat(chatID);
  }

  async deleteChatConfirmation(chatID) {
    const alert = await this.alertController.create({
      header: 'Delete this chat?',
      message: 'Are you sure you want to delete this message',
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
            this.deleteChat(chatID);
          }}
      ]
    });

    await alert.present();
  }
}
