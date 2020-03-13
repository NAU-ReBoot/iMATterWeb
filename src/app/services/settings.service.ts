import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Question} from './infoDesk/question.service';

export interface GiftCardType {
  id?: string;
  type: string;
}

export interface ProviderType {
  id?: string;
  type: string;
  profilePic: string;
}

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  private providerTypes: Observable<ProviderType[]>;
  private providerTypeCollection: AngularFirestoreCollection<ProviderType>;

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

  getAdminSettings() {
    return firebase.firestore().collection('mobileSettings').doc('adminSettings').get();
  }

  getProviderTypesCollection() {
    this.providerTypeCollection = this.afs.collection<ProviderType>('providerTypes');

    this.providerTypes = this.providerTypeCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getProviderTypes() {
    this.getProviderTypesCollection();
    return this.providerTypes;
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

  updateAutoProfilePic(newPic) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('userSignUpSettings').update({autoProfilePic: newPic});
  }

  updateAdminPic(newPic) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('adminSettings').update({profilePic: newPic});
  }

  addNewProfilePic(newPic) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('userSignUpSettings').update({profilePictures: firebase.firestore.FieldValue.arrayUnion(newPic)});
  }

  removeProfilePic(pic) {
    return this.afs.firestore.collection('mobileSettings')
        .doc('userSignUpSettings').update({profilePictures: firebase.firestore.FieldValue.arrayRemove(pic)});
  }


  addNewProviderType(providerType) {
    return this.providerTypeCollection.add(providerType);
  }

  removeProviderType(docID) {
    return this.providerTypeCollection.doc(docID).delete();
  }
}
