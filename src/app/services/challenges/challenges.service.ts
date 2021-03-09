import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import {File} from '@ionic-native/file/ngx';

// declares Survey object interface, making sure every Survey object has these fields
export interface Challenge {
    id?: string;
    title: string;
    description: string;
    type: string;
    length: number;
    pictures: any[];
    contents: any[];
}


@Injectable({
    providedIn: 'root'
})

export class ChallengeService {
    private challenges: Observable<Challenge[]>;
    private challengesCollection: AngularFirestoreCollection<Challenge>;

    constructor(private angularfs: AngularFirestore, private afs: AngularFireStorage) {
        // gets the collection of surveys
        this.challengesCollection = this.angularfs.collection<Challenge>('challenges');

        //  looks for changes and updates, also grabs the data
        this.challenges = this.challengesCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }

    // gets all of the surveys in the survey collection
    getChallenges() {
        return this.challenges;
    }
    //
    // // gets an individual survey with id provided
    // getSurvey(id: string){
    //     return this.surveyCollection.doc<Survey>(id).valueChanges().pipe(
    //         take(1),
    //         map(survey => {
    //             survey.id = id;
    //             return survey;
    //         })
    //     );
    // }
    //
    // adds the survey to the database
    addChallenge(challenge: Challenge): Promise<DocumentReference> {
        return this.challengesCollection.add(challenge);
    }
    //
    // // updates the survey in the database
    // updateSurvey(survey: Survey): Promise<void>{
    //     return this.surveyCollection.doc(survey.id).update({
    //         title: survey.title,
    //         display: survey.display,
    //         surveyLink: survey.surveyLink,
    //         type: survey.type,
    //         daysTillRelease: survey.daysTillRelease,
    //         daysBeforeDueDate: survey.daysBeforeDueDate,
    //         daysTillExpire: Number(survey.daysTillExpire),
    //         daysInactive: survey.daysInactive,
    //         emotionChosen: survey.emotionChosen,
    //         pointsWorth: Number(survey.pointsWorth),
    //         userVisibility: survey.userVisibility,
    //         surveyDescription: survey.surveyDescription});
    // }
    //
    // // deletes the survey with the id provided
    // deleteSurvey(id: string): Promise<void> {
    //     return this.surveyCollection.doc(id).delete();
    // }

    async uploadFileToStorage(file, type, name) {
        const randomId = Math.random()
            .toString(36)
            .substring(2, 8);

        const oMyBlob = new Blob([file], {type});

        const uploadTask = this.afs.upload(
            `files/${new Date().getTime()}_${randomId}_${name}`,
            oMyBlob
        );

        uploadTask.then(async res => {
            console.log('file upload finished!');
        }).catch(err =>  {
            console.log('file wasnt upload. Error: ' + err);
        });
    }
}
