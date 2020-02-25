import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface User {
  id?: string;
  code: string;
  username: string;
  email: string;
  password: string;
  dueMonth: string;
  weeksPregnant: number;
  profilePic: any;
  location: number;
  cohort: string;
  securityQ: string;
  securityA: string;
  currentEmotion: string;
  bio: string;
  points: number;
}

export interface Provider {
  id?: string;
  code: string;
  username: string;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  profilePic: any;
  dob: string;
  bio: string;
  type: string;
}

export interface Admin {
  id?: string;
  code: string;
  username: string;
  email: string;
  password: string;
  type: string;
  profilePic: any;
}

@Injectable({
  providedIn: 'root'
})

export class CreateUserService {
  private users: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;

  private providers: Observable<Provider[]>;
  private providerCollection: AngularFirestoreCollection<Provider>;

  private admins: Observable<Admin[]>;
  private adminCollection: AngularFirestoreCollection<Admin>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = this.afs.collection<User>('users', ref => ref.orderBy('username', 'asc'));
    this.users = this.userCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );

    this.providerCollection = this.afs.collection<Provider>('providers');
    this.providers = this.providerCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );

    this.adminCollection = this.afs.collection<Admin>('admins');
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

  getUsers(): Observable<User[]> {
    return this.users;
  }

  getUser(id: string): Observable<User> {
    return this.userCollection.doc<User>(id).valueChanges().pipe(
        take(1),
        map(user => {
          user.id = id;
          return user;
        })
    );
  }

  updateUser(userID: string, user: User) {
    this.afs.firestore.collection('users').where('code', '==', userID)
        .get().then(snapshot => {
      snapshot.forEach(doc => {
        return this.afs.firestore.collection('users').doc(userID).update(user);
      });
    });
  }

  deleteUser(id: string): Promise<void> {
    return this.userCollection.doc(id).delete();
  }

  addUser(user: User): Promise<void> {
    return this.userCollection.doc(user.code).set({code: user.code});
  }

  getProviders(): Observable<Provider[]> {
    return this.providers;
  }

  deleteProvider(id: string): Promise<void> {
    return this.providerCollection.doc(id).delete();
  }

  addProvider(provider: Provider): Promise<void> {
    return this.providerCollection.doc(provider.code).set({code: provider.code, email: provider.email,
    dob: provider.dob, firstName: provider.nameFirst, lastName: provider.nameLast, type: provider.type});
  }

  getAdmins(): Observable<Admin[]> {
    return this.admins;
  }

  deleteAdmin(id: string): Promise<void> {
    return this.adminCollection.doc(id).delete();
  }

  addAdmin(admin: Admin): Promise<void> {
    return this.adminCollection.doc(admin.code).set({code: admin.code, email: admin.email, type: admin.type});
  }
}
