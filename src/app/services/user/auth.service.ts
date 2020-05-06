import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Provider, Admin } from '../createUsers/create-user.service';
import 'firebase/auth';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceProvider {

  private providers: Observable<Provider[]>;
  private providerCollection: AngularFirestoreCollection<Provider>;

  private admins: Observable<Admin[]>;
  private adminCollection: AngularFirestoreCollection<Admin>;

  constructor(private afs: AngularFirestore) {
    this.providerCollection = this.afs.collection<Provider>('providers', ref => ref.orderBy('lastName', 'asc'));
    this.providers = this.providerCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );

    this.adminCollection = this.afs.collection<Admin>('admins', ref => ref.orderBy('email', 'asc'));
    this.admins = this.adminCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );
  }

  provider: Provider =  {
    code: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePic: '',
    bio: '',
    dob: '',
    type: '',
    providerType: '',
    notes: '',
    codeEntered: true
    // questionsAnswered: []
  };

  admin: Admin = {
    code: '',
    username: '',
    email: '',
    profilePic: '',
    password: '',
    type: '',
    notes: '',
    codeEntered: true
  };

  signupProvider(provider: Provider, password: string, username: string, email: string, bio: string): Promise<any> {
    return this.providerCollection.doc(provider.code).set({code: provider.code,
        password: password, username: username, email: email, bio: bio}, { merge: true } );
  }

  signupAdmin(admin: Admin, password: string, username: string, email: string): Promise<any> {
    return this.adminCollection.doc(admin.code).set({code: admin.code,
      password: password, username: username, email: email, profilePic: admin.profilePic}, { merge: true });
  }

}


