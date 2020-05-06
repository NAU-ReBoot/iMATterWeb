import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';

export interface Question {
  id?: string;
  title: string;
  description: string;
  username: string;
  userID: string;
  timestamp: any;
  profilePic: any;
  anon: boolean;
  numOfAnswers: number;
}

export interface Answer {
  id?: string;
  questionID: string;
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

  private answerCollection: AngularFirestoreCollection<Answer>;
  private answers: Observable<Answer[]>;
  private answer: Answer;

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

  getAnswers(questionID) {
    this.getAnswerCollection(questionID);
    return this.answers;
  }

  getAnswerCollection(questionID) {
    this.answerCollection = this.afs.collection('answers', ref => ref.where('questionID', '==', questionID).orderBy('timestamp'));
    this.answers = this.answerCollection.snapshotChanges().pipe(
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



  deleteQuestion(id: string): Promise<void> {

    this.afs.firestore.collection('answers').where('questionID', '==', id).get()
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

  async deleteAnswer(answerObj, questionID, questionObj) {
    this.afs.firestore.collection('questions')
        .doc(questionID).get().then((result) => {
      let currentNumOfAnswers = result.get('numOfAnswers');
      currentNumOfAnswers -= 1;
      this.afs.firestore.collection('questions')
          .doc(questionID).update({numOfAnswers: currentNumOfAnswers}).then(() => {
        this.answerCollection.doc(answerObj.id).delete();
      });
    });

    this.afs.firestore.collection('questions')
        .doc(questionID).update({commenters: firebase.firestore.FieldValue.arrayRemove(answerObj.userID)});
  }

  async addAnswer(answer: Answer) {

    this.afs.firestore.collection('questions')
        .doc(answer.questionID).update({numOfAnswers: firebase.firestore.FieldValue.increment(1),
      commenters: firebase.firestore.FieldValue.arrayUnion(answer.userID)});

    this.afs.collection('answers').add({
      username: answer.username,
      input: answer.input,
      questionID: answer.questionID,
      userID: answer.userID,
      timestamp: answer.timestamp,
      type: answer.type,
      profilePic: answer.profilePic
    });
  }

  reportQuestion(question, providerUsername) {
    this.afs.collection('providerReports').add({
      provider: providerUsername,
      username: question.username,
      input: question.description,
      questionID: question.id,
      userID: question.userID,
      title: question.title,
      timestampOfObj: question.timestamp,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      type: 'question'
    });
  }

  reportAnswer(question, answer, providerUsername) {

    this.afs.collection('providerReports').add({
      provider: providerUsername,
      username: answer.username,
      input: answer.input,
      question: question.id,
      answerID: answer.id,
      title: question.title,
      userID: answer.userID,
      timestampOfObj: answer.timestamp,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      type: 'answer'
    });
}


}
