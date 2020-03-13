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
  phone: string;
  operationMF: string;
  operationSaturday: string;
  operationSunday: string;
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
    this.locationCollection = this.afs.collection<Location>('resourceLocations', ref => ref.orderBy('timestamp', 'desc'));

    this.locations= this.locationCollection.snapshotChanges().pipe(
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


}
