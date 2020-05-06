import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Report {
  id?: string;
  title: string;
  description: string;
  username: string;
  userID: string;
  timestamp: any;
  type: any;
  operatingSys: string;
  version: string;
  viewed: false;
}

export interface LocationSuggestion {
  id?: string;
  name: string;
  address: string;
  reason: string;
  username: string;
  userID: string;
  timestamp: any;
  type: any;
  viewed: false;
}

export interface ProviderReport {
  id?: string;
  provider: string;
  postID: string;
  commentID?: string;
  input: string;
  title: '';
  username: string;
  userID: string;
  timestampOfObj: any;
  timestamp: any;
  type: string;
  viewed: false;
}


@Injectable({
  providedIn: 'root'
})
export class InboxService {
  private reports: Observable<Report[]>;
  private reportCollection: AngularFirestoreCollection<Report>;
  private report: Report;

  private locationSuggestions: Observable<LocationSuggestion[]>;
  private locationSuggestionsCollection: AngularFirestoreCollection<LocationSuggestion>;

  private providerReports: Observable<ProviderReport[]>;
  private providerReportsCollection: AngularFirestoreCollection<ProviderReport>;

  constructor(private afs: AngularFirestore) {
  }

  getReportCollection() {

    this.reportCollection = this.afs.collection<Report>('reports', ref => ref.orderBy('timestamp', 'desc'));

    this.reports = this.reportCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );

  }

  getReports(): Observable<Report[]> {
    this.getReportCollection();
    return this.reports;
  }

  getReport(id: string): Observable<Report> {
    return this.reportCollection.doc<Report>(id).valueChanges().pipe(
        take(1),
        map(report => {
          report.id = id;
          return report;
        })
    );
  }

  deleteReport(id: string): Promise<void> {
    return this.reportCollection.doc(id).delete();
  }

  getLocationSuggestionsCollection() {

    this.locationSuggestionsCollection = this.afs.collection<LocationSuggestion>('locationSuggestions', ref => ref.orderBy('timestamp', 'desc'));

    this.locationSuggestions = this.locationSuggestionsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getLocationSuggestions(): Observable<LocationSuggestion[]> {
    this.getLocationSuggestionsCollection();
    return this.locationSuggestions;
  }

  getLocationSuggestion(id: string): Observable<LocationSuggestion> {
    return this.locationSuggestionsCollection.doc<LocationSuggestion>(id).valueChanges().pipe(
        take(1),
        map(submission => {
          submission.id = id;
          return submission;
        })
    );
  }

  deleteLocationSuggestion(id: string): Promise<void> {
    return this.locationSuggestionsCollection.doc(id).delete();
  }


  getProviderReportsCollection() {
    this.providerReportsCollection = this.afs.collection<ProviderReport>('providerReports', ref => ref.orderBy('timestamp', 'desc'));

    this.providerReports = this.providerReportsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          });
        })
    );
  }

  getProviderReports(): Observable<ProviderReport[]> {
    this.getProviderReportsCollection();
    return this.providerReports;
  }

  getProviderReport(id: string): Observable<ProviderReport> {
    return this.providerReportsCollection.doc<ProviderReport>(id).valueChanges().pipe(
        take(1),
        map(providerReport => {
          providerReport.id = id;
          return providerReport;
        })
    );
  }

  deleteProviderReport(id: string): Promise<void> {
    return this.providerReportsCollection.doc(id).delete();
  }

  updateNotifAsSeen(id, type) {
    let collection;

    if (type === 'suggestion') {
      collection = 'locationSuggestions';
    } else if (type === 'pReport') {
      collection = 'providerReports';

    } else if (type === 'uReport') {
      collection = 'reports';
    }

    return this.afs.firestore.collection(collection)
        .doc(id).update({viewed: true});
  }


}
