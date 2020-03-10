import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {


  constructor(public afs: AngularFirestore) {}


  updateEmail(newEmail: string, password: string, providerID: string) {
      this.afs.firestore.collection('providers').where('code', '==', providerID)
          .get().then(snapshot => {
              snapshot.forEach(doc => {
                  const userPassword = doc.get('password');
                  if (userPassword === password) {
                      return this.afs.firestore.collection('providers')
                          .doc(providerID).update({email: newEmail});
                  }
              });
          });
  }

    updatePassword(newPassword: string, oldPassword: string, providerID: string) {
        this.afs.firestore.collection('providers').where('code', '==', providerID)
            .get().then(snapshot => {
            snapshot.forEach(doc => {
                const userPassword = doc.get('password');
                if (userPassword === oldPassword) {
                    return this.afs.firestore.collection('providers')
                        .doc(providerID).update({password: newPassword});
                }
            });
        });
    }

    updateBio(newBio: string, providerID: string) {
        return this.afs.firestore.collection('providers')
            .doc(providerID).update({bio: newBio});
    }
}
