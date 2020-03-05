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

  getChatRoomHourSetting() {
    return firebase.firestore().collection('mobileSettings').doc('chatHours').get();
  }

  getGCSettings() {
    return firebase.firestore().collection('mobileSettings').doc('giftCardSettings').get();
  }

  getUserSignUpSettings() {
    return firebase.firestore().collection('mobileSettings').doc('userSignUpSettings').get();
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


  addNewSecurityQ(newQ) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('userSignUpSettings').update({securityQs: firebase.firestore.FieldValue.arrayUnion(newQ)});
  }

  removeSecurityQ(newQ) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('userSignUpSettings').update({securityQs: firebase.firestore.FieldValue.arrayRemove(newQ)});
  }


}
