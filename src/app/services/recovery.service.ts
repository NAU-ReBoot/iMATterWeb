import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';


/**
 * This code written with the help of this tutorial:
 * https://devdactic.com/ionic-4-firebase-angularfire-2/
 * Used for storing and accessing learning module info in the database
 */

export interface RecoveryEmail {
    id?: string;
    email: string;
    code: string;
}

@Injectable({
    providedIn: 'root'
})
export class RecoveryEmailService {
    private recoveryEmail: Observable<RecoveryEmail[]>;
    private recoveryEmailCollection: AngularFirestoreCollection<RecoveryEmail>;

    constructor(private afs: AngularFirestore) {
        this.recoveryEmailCollection = this.afs.collection<RecoveryEmail>('recoveryEmail');
        this.recoveryEmail = this.recoveryEmailCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
    }

    async addRecovery(recoveryEmail: RecoveryEmail) {
        this.afs.collection('recoveryEmail').add({
            email: recoveryEmail.email,
            code: recoveryEmail.code,
            test: 'hello'
        });
    }


}
