import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';



export interface Location {
  id?: string;
  title: string;
  content: string;
  addressType: string;
  latitude: number;
  longitude: number;
  street: string;
  phone: string;
  MOpen: string;
  MClose: string;
  TOpen: string;
  TClose: string;
  WOpen: string;
  WClose: string;
  ThOpen: string;
  ThClose: string;
  FOpen: string;
  FClose: string;
  SatOpen: string;
  SatClose: string;
  SunOpen: string;
  SunClose: string;
  special: string;
  type: string;
  hourType: string;
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


  getLocationCollection() {
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


  getLocations(): Observable<Location[]> {
    this.getLocationCollection();
    return this.locations;
  }

  getLocation(id: string): Observable<Location> {
    return this.locationCollection.doc<Location>(id).valueChanges().pipe(
        take(1),
        map(location => {
          location.id = id;
          return location;
        })
    );
  }

  addLocation(location: Location): Promise<DocumentReference> {
    return this.locationCollection.add(location);
  }

  deleteLocation(id: string): Promise<void> {
    return this.locationCollection.doc(id).delete();
  }

  updateLocation(location: Location): Promise<void> {
     return this.locationCollection.doc(location.id).update({
       title: location.title,
       content: location.content,
       addressType: location.addressType,
       latitude: Number(location.latitude),
       longitude: Number(location.longitude),
       street: location.street,
       phone: location.phone,
       MOpen: location.MOpen,
       MClose: location.MClose,
       TOpen: location.TOpen,
       TClose: location.TClose,
       WOpen: location.WOpen,
       WClose: location.WClose,
       ThOpen: location.ThOpen,
       ThClose: location.ThClose,
       FOpen: location.FOpen,
       FClose: location.FClose,
       SatOpen: location.SatOpen,
       SatClose: location.SatClose,
       SunOpen: location.SunOpen,
       SunClose: location.SunClose,
       hourType: location.hourType,
       special: location.special,
       type: location.type
     });
  }


}
