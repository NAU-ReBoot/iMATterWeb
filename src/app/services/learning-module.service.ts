import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * This code written with the help of this tutorial:
 * https://devdactic.com/ionic-4-firebase-angularfire-2/
 * Used for storing and accessing learning module info in the database
 */
export interface LearningModule 
{
  id?:string, //this is ID of the new document added to the database, very important!
  moduleTitle: string,
  moduleDescription: string,
  moduleVideoID?: string, //YouTube video ID, optional
  modulePPTurl?: string, //powerpoint URL, optional
  moduleContent: string,
  moduleVisibilityTime: string,
  moduleExpiration: number,
  moduleActive: boolean,
  moduleQuiz: Question[],
  modulePointsWorth: number,
  moduleNext?: string, //ID of next learning module to go to, optional
  userVisibility: string[]
}

export interface Question
{
  questionText: string,
  choice1: string,
  choice2: string,
  choice3: string,
  choice4: string,
  correctAnswer: string,
  pointsWorth: number
}

@Injectable({
  providedIn: 'root'
})
export class LearningModuleService {

  private learningModules: Observable<LearningModule[]>;
  private learningModuleCollection: AngularFirestoreCollection<LearningModule>;

  private currentModule: LearningModule;

  constructor(private afs: AngularFirestore) {
    this.learningModuleCollection = this.afs.collection<LearningModule>('learningModules');
    this.learningModules = this.learningModuleCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getAllLearningModules(): Observable<LearningModule[]> {
    return this.learningModules;
  }
 
  getLearningModule(id: string): Observable<LearningModule> {
    return this.learningModuleCollection.doc<LearningModule>(id).valueChanges().pipe(
      take(1),
      map(learningModule => {
        learningModule.id = id;
        return learningModule
      })
    );
  }

  addLearningModule(learningModule: LearningModule): Promise<DocumentReference>
  {
    return this.learningModuleCollection.add(learningModule);
  }

  updateLearningModule(learningModule: LearningModule): Promise<void>
  {
    //pointsWorth was somehow being saved as a string, so ensure that they're numbers
    learningModule.moduleQuiz.forEach(element => {
      element.pointsWorth = Number(element.pointsWorth);
    });

    return this.learningModuleCollection.doc(learningModule.id).update({ 
      moduleTitle: learningModule.moduleTitle, 
      moduleDescription: learningModule.moduleDescription, 
      moduleVideoID: learningModule.moduleVideoID,
      modulePPTurl: learningModule.modulePPTurl, 
      moduleContent: learningModule.moduleContent, 
      moduleVisibilityTime: learningModule.moduleVisibilityTime,
      moduleExpiration: Number(learningModule.moduleExpiration),
      moduleActive: learningModule.moduleActive,
      moduleQuiz: learningModule.moduleQuiz,
      modulePointsWorth: Number(learningModule.modulePointsWorth),
      moduleNext: learningModule.moduleNext});
  }

  deleteLearningModule(id:string): Promise<void>
  {
    return this.learningModuleCollection.doc(id).delete();
  }

}
