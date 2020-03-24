import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {ToastController} from '@ionic/angular';



export interface PregnancyUpdateCard {
  id?: string;
  fileName: string;
  day: number;
  description: string;
  picture: string;
}


@Injectable({
  providedIn: 'root'
})


export class PregnancyUpdatesService {

  private pregnancyUpdates: Observable<PregnancyUpdateCard[]>;
  private pregnancyUpdatesCollection: AngularFirestoreCollection<PregnancyUpdateCard>;

  constructor(private afs: AngularFirestore) {
    this.pregnancyUpdatesCollection = this.afs.collection<PregnancyUpdateCard>('pregnancyUpdates', ref => ref.orderBy('day', 'asc'));
    this.pregnancyUpdates = this.pregnancyUpdatesCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
    );
  }

  getAllPregnancyUpdates(): Observable<PregnancyUpdateCard[]> {
    return this.pregnancyUpdates;
  }

  getPregnancyUpdate(id: string): Observable<PregnancyUpdateCard> {
    return this.pregnancyUpdatesCollection.doc<PregnancyUpdateCard>(id).valueChanges().pipe(
        take(1),
        map(pregnancyUpdate => {
          pregnancyUpdate.id = id;
          return pregnancyUpdate;
        })
    );
  }

  addPregnancyUpdate(pregnancyCard: PregnancyUpdateCard): Promise<void> {
    return this.pregnancyUpdatesCollection.doc(pregnancyCard.day.toString()).set({
      day: pregnancyCard.day,
      fileName: pregnancyCard.fileName,
      description: pregnancyCard.description,
      picture: pregnancyCard.picture});
  }

  updatePregnancyUpdate(pregnancyCard: PregnancyUpdateCard): Promise<void> {
    return this.pregnancyUpdatesCollection.doc(pregnancyCard.id).update({
      day: pregnancyCard.day,
      fileName: pregnancyCard.fileName,
      description: pregnancyCard.description,
      picture: pregnancyCard.picture});
  }

  deletePregnancyUpdate(id: string): Promise<void> {
    return this.pregnancyUpdatesCollection.doc(id).delete();
  }


}
