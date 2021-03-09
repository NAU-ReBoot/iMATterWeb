import {Component, OnInit} from '@angular/core';
import {ChallengeService, Challenge} from '../services/challenges/challenges.service';
import {Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';


@Component({
    selector: 'challenges',
    templateUrl: './challenges.page.html',
    styleUrls: ['./challenges.page.scss'],
})
export class ChallengesPage implements OnInit {
    public challenges: Observable<Challenge[]>;

    constructor(private fs: ChallengeService,
                private storage: Storage,
                private router: Router,
                private toastCtrl: ToastController) {
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

        this.challenges = this.fs.getChallenges();
    }
}
