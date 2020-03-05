import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryCodePageRoutingModule } from './recovery-code-routing.module';

import { RecoveryCodePage } from './recovery-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoveryCodePageRoutingModule
  ],
  declarations: [RecoveryCodePage]
})
export class RecoveryCodePageModule {}
