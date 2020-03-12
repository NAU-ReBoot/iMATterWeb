import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

export interface EmotionNotif {
  id?: string;
  username: string;
  userID: string;
  emotionEntered: string;
  viewed: boolean;
  timestamp: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderInboxService {

  private emotionNotifs: Observable<EmotionNotif[]>;
  private emotionNotifsCollection: AngularFirestoreCollection<EmotionNotif>;

  constructor(public afs: AngularFirestore) { }

  getEmotionNotifsCollection() {
    this.emotionNotifsCollection = this.afs.collection<EmotionNotif>('userEmotionNotifs',  ref => ref.orderBy('timestamp', 'desc'));

    this.emotionNotifs = this.emotionNotifsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getEmotionNotifs(): Observable<EmotionNotif[]> {
    this.getEmotionNotifsCollection();
    return this.emotionNotifs;
  }

  getEmotionNotif(id) {
    return this.emotionNotifsCollection.doc<EmotionNotif>(id).valueChanges().pipe(
          take(1),
          map(question => {
            question.id = id;
            return question;
          })
      );
  }

}
