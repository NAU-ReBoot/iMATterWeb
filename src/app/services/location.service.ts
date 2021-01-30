import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';



export interface Location {
  id?: string;
  title: string;
  content: string;
  latitude: number;
  longitude: number;
  street: string;
  phone: string;
  operationMOpen: string;
  operationMClose: string;
  operationTOpen: string;
  operationTClose: string;
  operationWOpen: string;
  operationWClose: string;
  operationThOpen: string;
  operationThClose: string;
  operationFOpen: string;
  operationFClose: string;
  operationSatOpen: string;
  operationSatClose: string;
  operationSunOpen: string;
  operationSunClose: string;
  special: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})


export class LocationService {
  private locations: Observable<Location[]>;
  private locationCollection: AngularFirestoreCollection<Location>;
  private location: Location;


  constructor(private afs: AngularFirestore) {

  }


  getLocationCollection()
  {
    this.locationCollection = this.afs.collection<Location>('resourceLocations', ref => ref.orderBy('title', 'asc'));

    this.locations = this.locationCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }


  getLocations(): Observable<Location[]>
  {
    this.getLocationCollection();
    return this.locations;
  }


  getLocation(id: string): Observable<Location> {
    return this.locationCollection.doc<Location>(id).valueChanges().pipe(
        take(1),
        map(location => {
          location.id = id;
          return location
        })
    );
  }


  addLocation(location: Location): Promise<DocumentReference> {
    return this.locationCollection.add(location);
  }

  deleteLocation(id: string): Promise<void> {
    return this.locationCollection.doc(id).delete();
  }

  updateLocation(location: Location): Promise<void>
  {
     return this.locationCollection.doc(location.id).update({
       title: location.title,
       content: location.content,
       latitude: Number(location.latitude),
       longitude: Number(location.longitude),
       street: location.street,
       phone: location.phone,
       operationMOpen: location.operationMOpen,
       operationMClose: location.operationMClose,
       operationTOpen: location.operationTOpen,
       operationTClose: location.operationTClose,
       operationWOpen: location.operationWOpen,
       operationWClose: location.operationWClose,
       operationThOpen: location.operationThOpen,
       operationThClose: location.operationThClose,
       operationFOpen: location.operationFOpen,
       operationFClose: location.operationFClose,
       operationSatOpen: location.operationSatOpen,
       operationSatClose: location.operationSatClose,
       operationSunOpen: location.operationSunOpen,
       operationSunClose: location.operationSunClose,
       special: location.special,
       type: location.type
     });
  }


}
