import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {QuotesCard, QuotesService} from '../services/quotes/quotes.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {AlertController, ToastController} from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
    selector: 'quotes',
    templateUrl: './quotes.page.html',
    styleUrls: ['./quotes.page.scss'],
})
export class QuotesPage implements OnInit {
    public quotes: Observable<QuotesCard[]>;
    public task: Promise<any>;
    public fileName: string;
    public uploadedFileURL: Observable<string>;
    public displayImage: string;
    public displayImageId: string;

    quote: QuotesCard = {
        filename: '',
        picture: ''
    };

    constructor(public quotesService: QuotesService,
                public router: Router,
                public storage: Storage,
                public alertController: AlertController,
                public fireStorage: AngularFireStorage,
                public toastCtrl: ToastController) {
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

    logForm() {
        console.log('FORM SUBMITTED');
        const file = (document.getElementById('pictureInput') as HTMLInputElement).files[0];
        if (file !== undefined) {
            this.fileName = file.name;
            // The storage path
            const path = `QuoteImages/${new Date().getTime()}_${file.name}`;
            // this.ch.fileName = `${new Date().getTime()}_${file.name}`;
            // File reference
            const fileRef = this.fireStorage.ref(path);
            // The main task
            this.task = this.fireStorage.upload(path, file).then(() => {
                // Get uploaded file storage path
                this.uploadedFileURL = fileRef.getDownloadURL();
                this.uploadedFileURL.subscribe(resp => {
                    this.quote.picture = resp;
                    this.quote.filename = this.fileName;
                    this.quotesService.addQuote(this.quote).then(() => {
                        this.showToast('Quote Added');
                        const formElem = (document.getElementById('newQuote') as HTMLElement);
                        formElem.classList.add('ion-hide');
                    });
                });
            });
        } else {
            this.showToast('ERROR: No File Submitted');
            console.log('No File Submitted');
        }
    }

    showForm() {
        const formElem = (document.getElementById('newQuote') as HTMLElement);
        formElem.classList.remove('ion-hide');
    }

    showImage(picture, id) {
        this.displayImageId = id;
        this.displayImage = picture;
        document.getElementById('overlay').style.display = 'block';
    }

    exitImage() {
        document.getElementById('overlay').style.display = 'none';
    }

    deleteQuote() {
        this.quotesService.deleteQuote(this.displayImageId);
        this.showToast('This image will not longer display to users.');
    }

    showToast(msg) {
        this.toastCtrl.create({
            message: msg,
            duration: 2000
        }).then(toast => toast.present());
    }
}
