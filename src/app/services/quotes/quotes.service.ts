import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {ToastController} from '@ionic/angular';
import {PregnancyUpdateCard} from "../PregnancyUpdates/pregnancy-updates.service";



export interface QuotesCard {
    id?: string;
    filename: string;
    picture: string;
}


@Injectable({
    providedIn: 'root'
})


export class QuotesService {

    private quotes: Observable<QuotesCard[]>;
    private quotesCollection: AngularFirestoreCollection<QuotesCard>;

    constructor(private afs: AngularFirestore) {
        this.quotesCollection = this.afs.collection<QuotesCard>('quotes');
        this.quotes = this.quotesCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }

    getAllQuotes(): Observable<QuotesCard[]> {
        return this.quotes;
    }

    getQuotes(id: string): Observable<QuotesCard> {
        return this.quotesCollection.doc<QuotesCard>(id).valueChanges().pipe(
            take(1),
            map(quotes => {
                quotes.id = id;
                return quotes;
            })
        );
    }
    // getPregnancyUpdate(id: string): Observable<PregnancyUpdateCard> {
    //     return this.pregnancyUpdatesCollection.doc<PregnancyUpdateCard>(id).valueChanges().pipe(
    //         take(1),
    //         map(pregnancyUpdate => {
    //             pregnancyUpdate.id = id;
    //             return pregnancyUpdate;
    //         })
    //     );
    // }
    //
    addQuote(quote: QuotesCard) {
        return this.afs.collection('quotes').add({
            filename: quote.filename,
            picture: quote.picture});
    }
    //
    // updatePregnancyUpdate(pregnancyCard: PregnancyUpdateCard): Promise<void> {
    //     console.log(pregnancyCard);
    //
    //     return this.pregnancyUpdatesCollection.doc(pregnancyCard.id).update({
    //         day: pregnancyCard.day,
    //         fileName: pregnancyCard.fileName,
    //         description: pregnancyCard.description,
    //         picture: pregnancyCard.picture});
    // }
    //
    // deletePregnancyUpdate(id: string): Promise<void> {
    //     return this.pregnancyUpdatesCollection.doc(id).delete();
    // }
}
