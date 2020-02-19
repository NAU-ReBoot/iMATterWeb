import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatlogPageRoutingModule } from './chatlog-routing.module';

import { ChatlogPage } from './chatlog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatlogPageRoutingModule
  ],
  declarations: [ChatlogPage]
})
export class ChatlogPageModule {}
