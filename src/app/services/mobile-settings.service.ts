import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Comment, Question} from './infoDesk/question.service';
import {map} from 'rxjs/operators';

export interface GiftCardType {
  id?: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})


export class MobileSettingsService {


  constructor(public afs: AngularFirestore) {

  }


  getSecurityQs() {
    return firebase.firestore().collection('mobileSettings').doc('securityQuestions').get();
  }

  getChatRoomHourSetting() {
    return firebase.firestore().collection('mobileSettings').doc('chatHours').get();
  }

  getGCSettings() {
    return firebase.firestore().collection('mobileSettings').doc('giftCardSettings').get();
  }


  updateSecurityQ(newSecurityQ, securityQ) {
    if (securityQ === 'q1') {
      return this.afs.firestore.collection('mobileSettings')
          .doc('securityQuestions').update({q1: newSecurityQ});
    } else if (securityQ === 'q2') {
      return this.afs.firestore.collection('mobileSettings')
          .doc('securityQuestions').update({q2: newSecurityQ});
    } else if (securityQ === 'q3') {
      return this.afs.firestore.collection('mobileSettings')
          .doc('securityQuestions').update({q3: newSecurityQ});
    }
  }

  updateChatHourstoLive(newHours) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('chatHours').update({hours: newHours});
  }

  updateGCEmail(newEmail) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('giftCardSettings').update({email: newEmail});
  }

  updatePointsToRedeemGC(newPoints) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('giftCardSettings').update({points: newPoints});
  }

  addGCType(gcType) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('giftCardSettings').update({types: firebase.firestore.FieldValue.arrayUnion(gcType)});
  }

  removeGCType(gcType) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('giftCardSettings').update({types: firebase.firestore.FieldValue.arrayRemove(gcType)});
  }


}
