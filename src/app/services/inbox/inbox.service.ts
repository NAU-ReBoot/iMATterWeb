import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Submission {
  id?: string;
  title: string;
  description: string;
  username: string;
  userID: string;
  timestamp: any;
  type: any;
  operatingSys: string;
  version: string;
}

export interface LocationSuggestion {
  id?: string;
  name: string;
  address: string;
  reason: string;
  username: string;
  userID: string;
  timestamp: any;
  type: any;
}


@Injectable({
  providedIn: 'root'
})
export class InboxService {
  private submissions: Observable<Submission[]>;
  private submissionCollection: AngularFirestoreCollection<Submission>;
  private submission: Submission;

  private locationSuggestions: Observable<LocationSuggestion[]>;
  private locationSuggestionsCollection: AngularFirestoreCollection<LocationSuggestion>;

  constructor(private afs: AngularFirestore) {
  }

  getSubmissionCollection() {

    this.submissionCollection = this.afs.collection<Submission>('submissions', ref => ref.orderBy('timestamp', 'desc'));

    this.submissions = this.submissionCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );

  }

  getSubmissions(): Observable<Submission[]> {
    this.getSubmissionCollection();
    return this.submissions;
  }

  getSubmission(id: string): Observable<Submission> {
    return this.submissionCollection.doc<Submission>(id).valueChanges().pipe(
        take(1),
        map(submission => {
          submission.id = id;
          return submission;
        })
    );
  }

  deleteSubmission(id: string): Promise<void> {
    return this.submissionCollection.doc(id).delete();
  }


  getLocationSuggestionsCollection() {

    this.locationSuggestionsCollection = this.afs.collection<LocationSuggestion>('locationSuggestions', ref => ref.orderBy('timestamp', 'desc'));

    this.locationSuggestions = this.locationSuggestionsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getLocationSuggestions(): Observable<LocationSuggestion[]> {
    this.getLocationSuggestionsCollection();
    return this.locationSuggestions;
  }

  getLocationSuggestion(id: string): Observable<LocationSuggestion> {
    return this.locationSuggestionsCollection.doc<LocationSuggestion>(id).valueChanges().pipe(
        take(1),
        map(submission => {
          submission.id = id;
          return submission;
        })
    );
  }

  deleteLocationSuggestion(id: string): Promise<void> {
    return this.locationSuggestionsCollection.doc(id).delete();
  }


}
