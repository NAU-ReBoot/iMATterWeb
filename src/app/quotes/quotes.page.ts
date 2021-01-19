import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {QuotesCard, QuotesService} from '../services/quotes/quotes.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'quotes',
    templateUrl: './quotes.page.html',
    styleUrls: ['./quotes.page.scss'],
})
export class QuotesPage implements OnInit {
    public quotes: Observable<QuotesCard[]>;

    constructor(public quotesService: QuotesService,
                public router: Router,
                public storage: Storage) {
    }

    ngOnInit() {
        this.storage.get('authenticated').then((val) => {
            if (val === 'false') {
                this.router.navigate(['/login/']);

            } else {
                this.storage.get('type').then((value) => {
                    if (value !== 'admin') {
                        this.router.navigate(['/login/']);
                    }
                });
            }
        });

        this.quotes = this.quotesService.getAllQuotes();
        console.log(this.quotes);
    }
}
