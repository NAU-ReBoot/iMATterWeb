import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LearningmodulesPageRoutingModule } from './learningmodules-routing.module';
import { LearningmodulesPage } from './learningmodules.page';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken, AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LearningmodulesPageRoutingModule,
    //AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    AngularFirestore,
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  declarations: [LearningmodulesPage]
})
export class LearningmodulesPageModule {}
