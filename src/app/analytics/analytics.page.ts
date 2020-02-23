import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map, take } from 'rxjs/operators';
// import { Chart } from "chart.js";
import {IonContent} from '@ionic/angular';
import { AnalyticsService, Analytics, Sessions, UniqueSessions} from '../services/analytics-service.service';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.page.html',
    styleUrls: ['./analytics.page.scss'],
})

export class AnalyticsPage {
//  @ViewChild('barChart') barChart;

//  @ViewChild('lineChart') lineChart;

    @ViewChild('content', {static: true}) content: IonContent;

    analytic: Analytics =
        {
            page: '',
            userID: '',
            timestamp: '',
            sessionID: ''
        }



    session : Sessions =
        {
            userID: '',
            LogOutTime: '',
            LoginTime: '',
            numOfClickChat: 0,
            numOfClickCalendar: 0,
            numOfClickLModule: 0,
            numOfClickInfo: 0,
            numOfClickSurvey: 0,
            numOfClickProfile: 0
        }


    uniqueSession: UniqueSessions =
        {
            page: '',
            userID: '',
            timestamp: '',
            sessionID: ''
            //  sessionID: string
        }


    USERID: string;
    myBarChart:any;
    myLineChart:any;
    private db: any;
    ARRAYOFIDS=[];
    COUNTER =0 ;
    INDEX = 0 ;

    private analyticss : string;
    private sessions : Observable<any>;
    private analytics: Observable<any>;
    private uniqueSessions: Observable<any>;


    constructor(
        //private storage: Storage,
        public afs: AngularFirestore,
        private analyticsService: AnalyticsService
    ) {
        this.db = firebase.firestore();
    }


    ionViewWillEnter(){
    }


    getAllSessions ()
    {
        this.sessions = this.analyticsService.getAllSessions();
    }

    getAllUserPages()
    {
        this.analytics = this.analyticsService.getAllUserPages();
    }



    getUserSessions(){

        console.log(this.USERID);


        this.uniqueSessions= this.analyticsService.getUniqueUserStorage(this.USERID);

    }

    getPageViews(id)
    {
        this.analyticsService.getPageViews(id);
    }


}
