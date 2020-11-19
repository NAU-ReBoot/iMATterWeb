import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { error } from 'util';

@Injectable({
    providedIn: 'root'
})

export class ProfileService {


    constructor(public afs: AngularFirestore) { }


    async updateEmail(newEmail: string, password: string, id: string, type: string) {
        const userRef = this.afs.firestore.collection('admins').doc(id);
        const userDoc = await userRef.get();
        const data = userDoc.data();
        console.log(data);

        if (data.password === password) {
            return userRef.update({ email: newEmail });
        } else {
            throw error;
        }

        /*
         this.afs.firestore.collection(type).where('code', '==', id)
             .get().then(snapshot => {
                 snapshot.forEach(doc => {
                     const userPassword = doc.get('password');
                     if (userPassword === password) {
                         return this.afs.firestore.collection(type)
                             .doc(id).update({ email: newEmail });

                     }
                 });
             });
        */
    }

    async updatePassword(newPassword: string, oldPassword: string, verifyPassword: string, id: string, type: string) {
        const userRef = this.afs.firestore.collection('admins').doc(id);
        const userDoc = await userRef.get();
        const data = userDoc.data();
        console.log(data);

        if (userDoc.get('password') === oldPassword) {
            console.log(userDoc.get('password'));
            return userRef.update({ password: newPassword });
        } else {
            throw error;
        }

        /*
        this.afs.firestore.collection(type).where('code', '==', id)
            .get().then(snapshot => {
                snapshot.forEach(doc => {
                    const userPassword = doc.get('password');
                    if (userPassword === oldPassword) {
                        return this.afs.firestore.collection('providers')
                            .doc(id).update({ password: newPassword });
                    }
                });
            });
        */
    }

    updateBio(newBio: string, providerID: string) {
        return this.afs.firestore.collection('providers')
            .doc(providerID).update({ bio: newBio });
    }
}
