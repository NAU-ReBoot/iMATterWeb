import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chatroom/chat-service.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-cohort-list',
  templateUrl: './chat-cohort-list.page.html',
  styleUrls: ['./chat-cohort-list.page.scss'],
})
export class ChatCohortListPage implements OnInit {

  public cohorts: any;

  constructor(public chatService: ChatService, public router: Router, public storage: Storage) {
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

}
