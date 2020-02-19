import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ChatService, Cohort, Chat } from '../services/chat-service.service';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';

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
    type: ''
  };

  private cohortChat: string;
  public chats: Observable<any>;
  private showLog: boolean;
  private id: any;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private storage: Storage,
              private chatService: ChatService,
              private afs: AngularFirestore) {

  }

  ngOnInit() {

    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.chats = this.chatService.getChats(this.id);
  }

  deleteChat(chatID) {
    this.chatService.deleteChat(chatID);
  }
}
