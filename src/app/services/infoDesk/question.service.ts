import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

export interface Question {
  id?: string;
  title: string;
  description: string;
  username: string;
  userID: string;
  timestamp: any;
  profilePic: any;
  anon: boolean;
}

export interface Comment {
  id?: string;
  postID: string;
  input: string;
  username: string;
  userID: string;
  timestamp: any;
  profilePic: any;
  type: string;
  anon: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Observable<Question[]>;
  private questionCollection: AngularFirestoreCollection<Question>;
  private question: Question;

  private commentCollection: AngularFirestoreCollection<Comment>;
  private comments: Observable<Comment[]>;
  private comment: Comment;

  private username: string;

  constructor(private afs: AngularFirestore, private storage: Storage) {
    this.questionCollection = this.afs.collection<Question>('questions', ref => ref.orderBy('timestamp', 'desc'));
    // this.commentCollection = this.afs.collection<Comment>('comments');

    this.questions = this.questionCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getQuestions(): Observable<Question[]> {
    return this.questions;
  }

  getComments(postID) {
    this.getCommentCollection(postID);
    return this.comments;
  }

  getCommentCollection(postID) {
    this.commentCollection = this.afs.collection('comments', ref => ref.where('postID', '==', postID).orderBy('timestamp'));
    this.comments = this.commentCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getQuestion(id: string): Observable<Question> {
    return this.questionCollection.doc<Question>(id).valueChanges().pipe(
        take(1),
        map(question => {
          question.id = id;
          return question;
        })
    );
  }

  addQuestion(question: Question): Promise<DocumentReference> {
    return this.questionCollection.add(question);
  }

  updateQuestion(question: Question): Promise<void> {
    return this.questionCollection.doc(question.id).update({title: question.title, description: question.description});
  }

  deleteQuestion(id: string): Promise<void> {

    this.afs.firestore.collection('comments').where('postID', '==', id).get()
        .then(querySnapshot => {
          // Once we get the results, begin a batch
          var batch = this.afs.firestore.batch();

          querySnapshot.forEach(doc => {
            // For each doc, add a delete operation to the batch
            batch.delete(doc.ref);
            batch.commit();
          });
        });

    return this.questionCollection.doc(id).delete();
  }

  deleteComment(id: string): Promise<void> {
    return this.commentCollection.doc(id).delete();
  }

  async addComment(comment: Comment) {
    this.afs.collection('comments').add({
      username: comment.username,
      input: comment.input,
      postID: comment.postID,
      userID: comment.userID,
      timestamp: comment.timestamp,
      type: comment.type,
      profilePic: comment.profilePic
    });
  }


}
