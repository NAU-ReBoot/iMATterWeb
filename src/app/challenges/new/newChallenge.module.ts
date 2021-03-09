import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewChallengePageRoutingModule } from './newChallenge-routing.module';

import { NewChallengePage } from './newChallenge.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NewChallengePageRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [NewChallengePage]
})
export class NewChallengePageModule {}
