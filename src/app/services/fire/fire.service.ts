import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore'
import { map, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

export interface Survey {
  id?: string;
  title: string;
  questions: Question[];
}

export interface Question{
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  choiceSelected?: string;
  type: string;
}

export interface User {
  id?: string;
  answered: [];
}

@Injectable({
  providedIn: 'root'
})

export class FireService {
  private surveys: Observable<Survey[]>;
  private surveyCollection: AngularFirestoreCollection<Survey>;
  
  constructor(private angularfs: AngularFirestore) {
    this.surveyCollection = this.angularfs.collection<Survey>('surveys');
    this.surveys = this.surveyCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
   }

   getSurveys(){
    return this.surveys;
  }

  getSurvey(id: string){
    return this.surveyCollection.doc<Survey>(id).valueChanges().pipe(
      take(1),
      map(survey => {
        survey.id = id;
        return survey  
      })
    );
  }
  
  addSurvey(survey: Survey): Promise<DocumentReference>{
    return this.surveyCollection.add(survey);
  }

  deleteSurvey(id: string): Promise<void>{
    return this.surveyCollection.doc(id).delete();
  }

  updateQuestions(surveyId: string, questions: Question[]) {
    return this.angularfs
      .collection('surveys')
      .doc(surveyId)
      .update({ questions });
  }

  userAnswerSubmit(answers: any[]){
    return this.angularfs.collection('users').add({
      answered: answers
    });
  }
}
