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
}


@Injectable({
  providedIn: 'root'
})
export class InboxService {
  private submissions: Observable<Submission[]>;
  private submissionCollection: AngularFirestoreCollection<Submission>;
  private submission: Submission;

  constructor(private afs: AngularFirestore) {
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

}
