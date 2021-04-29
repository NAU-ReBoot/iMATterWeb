import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengeTypesPageRoutingModule } from './challengeTypes-routing.module';

import { ChallengeTypesPage } from './challengeTypes.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChallengeTypesPageRoutingModule
    ],
    declarations: [ChallengeTypesPage]
})
export class ChallengeTypesPageModule {}
