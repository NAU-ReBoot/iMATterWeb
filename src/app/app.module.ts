import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {File} from '@ionic-native/file/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuizModalPageModule } from './learningModule/quiz-modal/quiz-modal.module';
import { AddQuizQuestionPageModule } from './learningModule/add-quiz-question/add-quiz-question.module';
import { DatePickerModule } from 'ionic4-date-picker';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment),
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    QuizModalPageModule,
    AddQuizQuestionPageModule,
    AngularFireStorageModule,
    DatePickerModule,
    HttpClientModule,
  ],

  providers: [
      File,
      WebView,
      Camera,
      FilePath,
      FileChooser,
      StatusBar,
      SplashScreen,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
