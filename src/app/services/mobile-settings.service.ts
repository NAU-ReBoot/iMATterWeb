import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})



export class MobileSettingsService {

  constructor(public afs: AngularFirestore) { }


  getSecurityQs() {
    return firebase.firestore().collection('mobileSettings').doc('securityQuestions').get();
  }

  getChatRoomHourSetting() {
    return firebase.firestore().collection('mobileSettings').doc('chatHours').get();
  }

  updateSecurityQ(newSecurityQ, securityQ) {
    if (securityQ === 'q1') {
      return this.afs.firestore.collection('mobileSettings')
          .doc('securityQuestions').update({q1: newSecurityQ});
    } else if (securityQ === 'q2') {
      return this.afs.firestore.collection('mobileSettings')
          .doc('securityQuestions').update({q2: newSecurityQ});
    } else if (securityQ === 'q33') {
      return this.afs.firestore.collection('mobileSettings')
          .doc('securityQuestions').update({q3: newSecurityQ});
    }
  }

}
