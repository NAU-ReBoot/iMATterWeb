import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatCohortListPageRoutingModule } from './chat-cohort-list-routing.module';

import { ChatCohortListPage } from './chat-cohort-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatCohortListPageRoutingModule
  ],
  declarations: [ChatCohortListPage]
})
export class ChatCohortListPageModule {}
