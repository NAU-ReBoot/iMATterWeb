import { Component, ViewChild, OnInit } from '@angular/core';
import  Chart  from "chart.js";
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map, take } from 'rxjs/operators';
import { IonContent } from '@ionic/angular';
import { AnalyticsService, Analytics, Sessions, UniqueSessions} from '../services/analytics-service.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import { DatePickerModule } from 'ionic4-date-picker';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.page.html',
    styleUrls: ['./analytics.page.scss'],
})


export class AnalyticsPage implements OnInit{


@ViewChild('lineChart', {static: false}) lineChart;
@ViewChild('barChart', {static: false}) barChart;


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
            numOfClickProfile: 0,
            numOfClickMore: 0
        }


    uniqueSession: UniqueSessions =
        {
            page: '',
            userID: '',
            timestamp: '',
            sessionID: ''
        }


    USERID: string;
    myBarChart:any;
    myLineChart:any;
    private db: any;
    public ref: any;

// individual user values
    public chatCounter: number;
    public chatHolder: number;
    public calendarCounter: number;
    public calendarHolder: number;
    public infoCounter: number;
    public infoHolder: number;
    public moduleCounter: number;
    public moduleHolder: number;
    public surveyCounter: number;
    public surveyHolder: number;
    public profileCounter: number;
    public profileHolder: number;
    public moreCounter: number;
    public moreHolder: number;

// viewing values
    public pageStatistics = true;
    public submitted= false;
    public durationPage = false;
    public durationSubmitted = false;

    public calendarArray: any = [];
    public calendarAverageArray: any =[];
    public calendarAverage: number;
    public timeCalendarArray:{ Date: any , Number: any}[] = [];
    public timeStamp: any;
    public calendarNumberHolder: any = [];
    public timestampCalendarHolder: any = [];


    public currentView : string;
    public currentTime: any;
    public epochArray: any = [];
    public pageviewArray: any =[];
    public durationHolder: any;
    public durationArray: { Time: any, Page: string }[] =[];

// services calues
    private analyticss : string;
    private sessions : Observable<any>;
    private analytics: Observable<any>;
    private uniqueSessions: Observable<any>;

// date range values
    public today: any;
    public yesterday: any;
    public todayMinusOne:any;
    public minEndDay:any;
    public startDate: any;

    public minStartToEnd: any;
    public maxStartToEnd: any;
    public endDate: any;
    public dayDifference: any;
    public minDate : any;


// am and pm values
    public timeOfDayArray: any = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    public pageString: string;


    public sessionIDHolder: any;
    public sessionDocument : any;
    public loginTimeData: any;
    public logoutTimeData: any;
    public quantityCalculation: any;
    public beginningOfSessionIndex: number;
    public endOfSessionIndex: number;

    public finalDurationArray:any = [0,0,0,0,0,0];
    public flag: boolean;

    public logArray: { Time: any, Page: string , Session:string }[] =[];
    public timePageArray: { Time: any, Session:any, Page: string }[] =[];
    public totalTimePageArray: { Time: any, Page: string }[] =[];
    public sessionArray : any = [];
    public displayDuration: any;
    public openFromCalendarSwitch= false;
    public openToCalendarSwitch = false;
    public fromDateString: any;
    public toDateString:any;


    private _CANVAS  : any;





    constructor(
    //    private storage: Storage,
        public afs: AngularFirestore,
        private analyticsService: AnalyticsService,
        private router: Router, private storage: Storage
    ) {
        this.db = firebase.firestore();
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

        this.maxsStartDate();
        this.findMinDate();
    }


    ionViewWillEnter()
    {
  //    this.getAllTotalClicks();
      this.durationPage = false;
    }

    ionViewDidEnter()
    {
      this.pageStatistics = true;
      this.durationPage = false;
      this.durationSubmitted = false;
    }

    ionViewDidLoad()
    {

    }

    pageStatsOff ()
    {
      this.pageStatistics = false;
      this.submitted = false;
      this.durationPage = true;
      this.finalDurationArray= [0,0,0,0,0,0];
      this.totalDurationMeasuresCalculation("initial");

    }

    pageStatsOn()
    {
      this.pageStatistics = true;
      this.durationPage = false;
      this.submitted = false;
      this.durationSubmitted = false;
    }

    On()
    {
      this.submitted = true;
    }

    durationOn()
    {
      this.durationSubmitted = true;
    }

    dateSelected(start:Date)
     {
       this.startDate= start;
       this.fromDateString = this.startDate.toString().split(" ").slice(0, 4).join(" ");
       console.log(this.startDate);
       console.log(this.fromDateString);


     }


     dateSelectedEnd(end:Date)
      {
        this.endDate= end;
        this.toDateString = this.startDate.toString().split(" ").slice(0, 4).join(" ");

      }


    findMinDate()
    {
      this.minDate = new Date('2020-04-08')
    }



          maxsStartDate() {
            this.today = new Date();
            this.today.setHours(0);
            this.today.setMinutes(0);
            this.today.setMilliseconds(0);
            this.today.setSeconds(0);
            this.yesterday = new Date();
            this.yesterday.setHours(0);
            this.yesterday.setMinutes(0);
            this.yesterday.setMilliseconds(0);
            this.yesterday.setSeconds(0);
            this.yesterday.setDate(this.today.getDate()-1);


          }


          minEndDate()
          {
            this.minStartToEnd = this.startDate;
            console.log(this.minStartToEnd);

            this.maxStartToEnd = this.today;
            console.log(this.maxStartToEnd);

          }
          openFromCalendar()
          {
            this.openFromCalendarSwitch = true;

          }

          closeFromCalendar()
          {
            this.openFromCalendarSwitch = false;

          }


          openToCalendar()
          {
            this.openToCalendarSwitch = true;

          }

          closeToCalendar()
          {
            this.openToCalendarSwitch = false;

          }



    async getDurationMeasures(state)
    {

      if (state == "initial")
      {
        this.startDate = new Date();
        this.startDate.setHours(0);
        this.startDate.setMinutes(0);
        this.startDate.setMilliseconds(0);
        this.startDate.setSeconds(0);
        this.startDate.setDate(this.startDate.getDate()-1);

        this.endDate = new Date();
        this.endDate.setHours(23);
        this.endDate.setMinutes(59);
        this.endDate.setMilliseconds(59);
        this.endDate.setSeconds(59);
      }
      else
      {
        this.startDate = this.startDate;
        this.startDate.setHours(0);
        this.startDate.setMinutes(0);
        this.startDate.setMilliseconds(0);
        this.startDate.setSeconds(0);

        this.endDate = this.endDate;
        this.endDate.setHours(23);
        this.endDate.setMinutes(59);
        this.endDate.setMilliseconds(59);
        this.endDate.setSeconds(59);

      }


      let ref = this.afs.firestore.collection("analyticsSessions");
      await ref.where('LoginTime', '>=', this.startDate). where('LoginTime' , '<=', this.endDate).orderBy('LoginTime')
          .get().then( (result) =>{
            this.loginTimeData = 0;
            this.logoutTimeData = 0;
            this.sessionIDHolder='';


            result.forEach( async doc =>{


            if(doc.get("LogOutTime") !=="" && doc.get("LoginTime") !== "")
              {
                console.log("document id = " + doc.id);

                this.sessionIDHolder = doc.id;

                 /*log in time*/
                  this.loginTimeData = doc.get("LoginTime");

                  this.loginTimeData = new Date (this.loginTimeData.toDate());
                  this.loginTimeData = this.loginTimeData.getTime();


                  /*log out time*/
                  this.logoutTimeData= doc.get("LogOutTime");

                  this.logoutTimeData = new Date (this.logoutTimeData.toDate());
                  this.logoutTimeData = this.logoutTimeData.getTime();

                  this.logArray.push({Time: this.loginTimeData , Page:'login', Session: this.sessionIDHolder});

                  this.sessionArray.push (this.sessionIDHolder);

                    this.logArray.push({Time: this.logoutTimeData , Page:'logout' , Session: this.sessionIDHolder});
                    this.setlogArray(this.logArray);

              }

            });
            this.setlogArray(this.logArray);
          });
    }

    async totalDurationMeasuresCalculation(state)
    {


      this.timePageArray.length = 0;
      this.timeOfDayArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.sessionArray.length = 0;
      this.calendarAverageArray.length = 0 ;
      this.totalTimePageArray.length = 0 ;
      this.durationArray.length = 0;
      this.logArray.length = 0 ;
      this.finalDurationArray= [0,0,0,0,0,0];
      console.log(this.timePageArray);
      console.log(this.timeOfDayArray);
      console.log(this.sessionArray);
      console.log(this.calendarAverageArray);
      console.log(this.totalTimePageArray);
      console.log(this.durationArray);
      console.log(this.logArray);
      console.log(this.finalDurationArray);







      console.log("inside tester");
      console.log("about call getmeasures ");

      await this.getDurationMeasures(state);
      await this.storageCaller();

      console.log("after tester");
      console.log("about to print arrays");

      console.log(this.logArray);
      console.log(this.timePageArray);

      await this.combineArraysForDuration();
      console.log("about to print totalTimePageArray");

      console.log(this.totalTimePageArray);

      this.calculatingDuration(this.totalTimePageArray);
      console.log(this.finalDurationArray);
      this.createBarChart();

      this.barChart.ngOnChanges();



    }



    async storageCaller()
    {


      let secondref = this.afs.firestore.collection("analyticsStorage");
      for( const session of this.sessionArray )
      {
        const result = await secondref.where('sessionID', '==', session).orderBy('timestamp')
                        .get().then((result) =>{
                          this.currentTime = null;
                          this.currentView ='';

                          result.forEach(doc =>{

                            this.currentView = doc.get("page");
                            this.currentTime = doc.get("timestamp");
                            this.sessionDocument = doc.get("sessionID");

                            this.currentTime = new Date(this.currentTime.toDate());
                            this.currentTime = this.currentTime.getTime();
                            this.timePageArray.push({Time: this.currentTime, Session: this.sessionDocument , Page: this.currentView});
                          });
                          this.setTimePageArray(this.timePageArray);
                        });
          }
      }


        async  combineArraysForDuration()
          {


           for(let logIndex=0 ;  logIndex <= this.logArray.length-1 ; logIndex++ )
              {

                this.totalTimePageArray.push({Time: this.logArray[logIndex].Time,
                   Page: this.logArray[logIndex].Page});

                for(let pageIndex =0; pageIndex <= this.timePageArray.length-1 ;pageIndex++ )
                {

                  if(this.logArray[logIndex].Session === this.timePageArray[pageIndex].Session &&
                    this.logArray[logIndex].Page !== 'logout')
                  {

                    this.totalTimePageArray.push({Time: this.timePageArray[pageIndex].Time ,
                                                  Page: this.timePageArray[pageIndex].Page});
                    this.saveTotaltimeArray(this.totalTimePageArray);

                  }

                }


              this.saveTotaltimeArray(this.totalTimePageArray);

              }
              this.saveTotaltimeArray(this.totalTimePageArray);


            }

        saveTotaltimeArray(totalTimePageArray)
        {
          this.totalTimePageArray = totalTimePageArray;
        }



    async  getMeasureForPages()
        {
          this.timePageArray.length = 0;
          this.timeOfDayArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          this.timePageArray=[];
          this.sessionArray.length = 0;
          this.calendarAverageArray.length = 0 ;
          this.totalTimePageArray.length = 0 ;
          this.durationArray.length = 0;
          this.logArray.length = 0 ;
          this.finalDurationArray= [0,0,0,0,0,0];
          this.displayDuration = 0;

          await this.getMeasures();
          await this.getStorage();
          console.log("after tester");
          console.log("about to print arrays");

          console.log(this.logArray);
          console.log(this.timePageArray);

          this.setCalendarAverageArray(this.calendarAverageArray);

          this.calendarAverageCalculation();
          console.log(this.calendarAverage);

          this.savingTimeOfDayArray(this.timeOfDayArray);
          await this.combineArraysForDuration();
          console.log("about to print totalTimePageArray");

          console.log(this.totalTimePageArray);

          this.calculatingDuration(this.totalTimePageArray);
          console.log(this.finalDurationArray);
          this.displayDurationCalculation();


          console.log('this time of day array');
          console.log(this.timeOfDayArray);



          this.createLineChart();



          this.timeOfDayArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }





    async getMeasures()
    {
      console.log("start date " + this.startDate);
      console.log("end date " + this.endDate);
      this.beginningOfSessionIndex = 0;
      this.endOfSessionIndex = 0;
      this.calendarAverageArray = new Array();

      this.startDate = new Date(this.startDate);
      this.startDate.setHours(0);
      this.startDate.setMinutes(0);
      this.startDate.setMilliseconds(0);
      this.startDate.setSeconds(0);

      this.endDate = new Date(this.endDate);
      this.endDate.setHours(23);
      this.endDate.setMinutes(59);
      this.endDate.setMilliseconds(59);
      this.endDate.setSeconds(59);

      this.dayDifference = this.endDate.getDate() - this.startDate.getDate();
      let ref = this.afs.firestore.collection("analyticsSessions");

      await ref.where('LoginTime' , '>=', this.startDate).where('LoginTime' , '<=', this.endDate)
      .get().then((result) =>{
        this.loginTimeData = 0;
        this.logoutTimeData = 0;

        result.forEach( async doc => {


                  if(doc.get("LoginTime") !== "" && doc.get("LogOutTime")!== "")
                  {

                    console.log("document id = " + doc.id);

                      this.sessionIDHolder = doc.id;
                      // log in time

                      this.loginTimeData = doc.get("LoginTime");

                      this.loginTimeData = new Date (this.loginTimeData.toDate());
                      this.loginTimeData = this.loginTimeData.getTime();



                      // log out time
                      this.logoutTimeData= doc.get("LogOutTime");
                      this.logoutTimeData = new Date (this.logoutTimeData.toDate());

                      this.logoutTimeData = this.logoutTimeData.getTime();

                      this.logArray.push({Time: this.loginTimeData , Page:'login', Session: this.sessionIDHolder});
                      this.sessionArray.push (this.sessionIDHolder);

                      this.logArray.push({Time: this.logoutTimeData , Page:'logout' , Session: this.sessionIDHolder});

                      this.setlogArray(this.logArray);


                      if(this.pageString === "calendar")
                      {
                        this.calendarAverageArray.push(doc.get("numOfClickCalendar"));

                      }
                      if(this.pageString === "chat")
                      {
                        this.calendarAverageArray.push(doc.get("numOfClickChat"));
                      }
                      if (this.pageString ==="home") {
                        this.calendarAverageArray.push(doc.get("numOfClickHome"));
                      }
                      if (this.pageString ==="infoDesk") {
                        this.calendarAverageArray.push(doc.get("numOfClickInfo"));
                      }
                      if (this.pageString ==="learningModule") {
                        this.calendarAverageArray.push(doc.get("numOfClickLModule"));
                      }
                      if (this.pageString ==="survey") {
                        this.calendarAverageArray.push(doc.get("numOfClickSurvey"));
                      }
                  }

                  this.setCalendarAverageArray(this.calendarAverageArray);

        });
        this.setCalendarAverageArray(this.calendarAverageArray);

      });


    }


    async getStorage()
    {

          let secondref = this.afs.firestore.collection("analyticsStorage");
          for(const session of this.sessionArray)
          {

            const result = await secondref.where('sessionID', '==', session).orderBy('timestamp')
                .get().then((result) =>{
                  this.currentTime = null;
                  this.currentView = '';


                  result.forEach( async doc =>{
                    // get the page of the storage
                    this.currentView = doc.get("page");
                    this.currentTime = doc.get("timestamp");
                    this.sessionDocument = doc.get("sessionID");

                    this.currentTime = new Date(this.currentTime.toDate());


                    if (this.currentView === this.pageString )
                    {

                      // checks the hours of the time
                      if(this.currentTime.getHours() === 0 )
                      {
                        this.timeOfDayArray[0] = this.timeOfDayArray[0] + 1;

                      }
                      if(this.currentTime.getHours() === 1)
                      {
                          this.timeOfDayArray[1] = this.timeOfDayArray[1] + 1;

                      }
                      if(this.currentTime.getHours() === 2)
                      {
                          this.timeOfDayArray[2] = this.timeOfDayArray[2] + 1;

                      }
                      if(this.currentTime.getHours() === 3)
                      {
                          this.timeOfDayArray[3] = this.timeOfDayArray[3] + 1;

                      }
                      if(this.currentTime.getHours() === 4)
                      {
                          this.timeOfDayArray[4] = this.timeOfDayArray[4] + 1;
                      }
                      if(this.currentTime.getHours() === 5)
                      {
                          this.timeOfDayArray[5] = this.timeOfDayArray[5] + 1;
                      }
                      if(this.currentTime.getHours() === 6)
                      {
                          this.timeOfDayArray[6] = this.timeOfDayArray[6] + 1;
                      }
                      if(this.currentTime.getHours() === 7)
                      {
                          this.timeOfDayArray[7] = this.timeOfDayArray[7] + 1;
                      }
                      if(this.currentTime.getHours() === 8)
                      {
                          this.timeOfDayArray[8] = this.timeOfDayArray[8] + 1;
                      }
                      if(this.currentTime.getHours() === 9)
                      {
                          this.timeOfDayArray[9] = this.timeOfDayArray[9] + 1;
                      }
                      if(this.currentTime.getHours() === 10)
                      {
                          this.timeOfDayArray[10] = this.timeOfDayArray[10] + 1;
                      }
                      if(this.currentTime.getHours() === 11)
                      {
                          this.timeOfDayArray[11] = this.timeOfDayArray[11] + 1;
                      }
                      if(this.currentTime.getHours() === 12)
                      {
                          this.timeOfDayArray[12] = this.timeOfDayArray[12] + 1;
                      }
                      if(this.currentTime.getHours() === 13)
                      {
                          this.timeOfDayArray[13] = this.timeOfDayArray[13] + 1;
                      }
                      if(this.currentTime.getHours() === 14)
                      {
                          this.timeOfDayArray[14] = this.timeOfDayArray[14] + 1;
                      }
                      if(this.currentTime.getHours() === 15)
                      {
                          this.timeOfDayArray[15] = this.timeOfDayArray[15] + 1;
                      }
                      if(this.currentTime.getHours() === 16)
                      {
                          this.timeOfDayArray[16] = this.timeOfDayArray[16] + 1;
                      }
                      if(this.currentTime.getHours() === 17)
                      {
                          this.timeOfDayArray[17] = this.timeOfDayArray[17] + 1;
                      }
                      if(this.currentTime.getHours() === 18)
                      {
                          this.timeOfDayArray[18] = this.timeOfDayArray[18] + 1;
                      }
                      if(this.currentTime.getHours() === 19)
                      {
                          this.timeOfDayArray[19] = this.timeOfDayArray[19] + 1;
                      }
                      if(this.currentTime.getHours() === 20)
                      {
                          this.timeOfDayArray[20] = this.timeOfDayArray[20] + 1;
                      }
                      if(this.currentTime.getHours() === 21)
                      {
                          this.timeOfDayArray[21] = this.timeOfDayArray[21] + 1;
                      }
                      if(this.currentTime.getHours() === 22)
                      {
                          this.timeOfDayArray[22] = this.timeOfDayArray[22] + 1;
                      }
                      if(this.currentTime.getHours() === 23)
                      {
                          this.timeOfDayArray[23] = this.timeOfDayArray[23] + 1;
                      }
                      if(this.currentTime.getHours() === 24)
                      {
                          this.timeOfDayArray[24] = this.timeOfDayArray[24] + 1;
                      }
                    }

                    this.currentTime = this.currentTime.getTime();
                    this.timePageArray.push({Time: this.currentTime, Session: this.sessionDocument , Page: this.currentView});

                  });
                });
          }
    }

    displayDurationCalculation()
    {
      if(this.pageString == "calendar")
      {
        this.displayDuration = this.finalDurationArray[0];
      }
      if(this.pageString == "chat")
      {
        this.displayDuration = this.finalDurationArray[1];
      }
      if(this.pageString == "home")
      {
        this.displayDuration = this.finalDurationArray[2];
      }
      if(this.pageString == "infoDesk")
      {
        this.displayDuration = this.finalDurationArray[3];
      }
      if(this.pageString == "learningModule")
      {
        this.displayDuration = this.finalDurationArray[4];
      }
      if(this.pageString == "survey")
      {
        this.displayDuration = this.finalDurationArray[5];
      }
    }





    savingTimeOfDayArray(timeOfDayArray)
    {
      this.timeOfDayArray = timeOfDayArray;
    }





    getUserTime()
    {

      let ref = this.afs.firestore.collection("analyticsStorage");
      ref.where('userID', '==', this.USERID).orderBy('timestamp')
          .get().then((result) =>{
            this.currentTime = null;
            this.currentView ='';

            result.forEach(doc =>{

              this.currentView = doc.get("page");
              this.currentTime = doc.get("timestamp");

              this.currentTime = new Date(this.currentTime.toDate());
              this.currentTime = this.currentTime.getTime();
              this.epochArray.push(this.currentTime);
              this.pageviewArray.push(this.currentView);
            });

        //  this.calculatingDuration(this.epochArray, this.pageviewArray);
          });
    }

        getUserTotalClicks()
        {

          let ref = this.db.collection("analyticsSessions");
          ref.where('userID', '==', this.USERID)
              .get().then((result) =>{

               this.chatCounter =0;
               this.calendarCounter =0;
               this.infoCounter = 0 ;
               this.surveyCounter =0;
               this.moduleCounter =0;
               this.profileCounter = 0;
               this.moreCounter = 0 ;

                result.forEach(doc =>{

                  this.chatCounter = this.chatCounter + doc.get("numOfClickChat");
                  this.calendarCounter = this.calendarCounter + doc.get("numOfClickCalendar");
                  this.moduleCounter = this.moduleCounter + doc.get("numOfClickLModule");
                  this.infoCounter = this.infoCounter + doc.get("numOfClickInfo");
                  this.surveyCounter = this.surveyCounter + doc.get("numOfClickSurvey");
                  this.profileCounter = this.profileCounter + doc.get("numOfClickProfile");
                  this.moreCounter = this.moreCounter + doc.get("numOfClickMore");

                });

                this.chatClicksSaver( this.chatCounter);
                this.calendarClicksSaver(this.calendarCounter);
                this.moduleClicksSaver(this.moduleCounter);
                this.infoClicksSaver(this.infoCounter);
                this.surveyClicksSaver(this.surveyCounter);
                this.profileClicksSaver(this.profileCounter);
                this.moreClicksSaver(this.moreCounter);


              });
        }


/*

    getAllTotalClicks()
    {
        this.db.collection("analyticsSessions").get()
        .then(querySnapshot => {

        this.chatCounter =0;
        this.calendarCounter =0;
        this.infoCounter = 0 ;
        this.surveyCounter =0;
        this.moduleCounter =0;
        this.profileCounter = 0;
        this.moreCounter = 0 ;

        querySnapshot.docs.forEach(doc => {
          this.chatCounter = this.chatCounter + doc.get("numOfClickChat");
          this.calendarCounter = this.calendarCounter + doc.get("numOfClickCalendar");
          this.calendarAverageArray.push(this.calendarCounter);
        //  this.calendarArray.push(doc.get("numOfClickCalendar"));
          this.timeStamp = doc.get("LoginTime");
          this.timeStamp = new Date (this.timeStamp.toDate());
          this.timeCalendarArray.push({Date: this.timeStamp , Number:doc.get("numOfClickCalendar")});
          this.moduleCounter = this.moduleCounter + doc.get("numOfClickLModule");
          this.infoCounter = this.infoCounter + doc.get("numOfClickInfo");
          this.surveyCounter = this.surveyCounter + doc.get("numOfClickSurvey");
          this.profileCounter = this.profileCounter + doc.get("numOfClickProfile");
          this.moreCounter = this.moreCounter + doc.get("numOfClickMore");

      });

      this.chatClicksSaver( this.chatCounter);
      this.calendarClicksSaver(this.calendarCounter);

      console.log(this.calendarArray);
      this.moduleClicksSaver(this.moduleCounter);
      this.infoClicksSaver(this.infoCounter);
      this.surveyClicksSaver(this.surveyCounter);
      this.profileClicksSaver(this.profileCounter);
      this.moreClicksSaver(this.moreCounter);
      this.calendarAverageCalculation(this.calendarAverageArray);
      this.setCalendarAverageArray(this.calendarAverageArray);
      this.timeCalendarArray = this.timeCalendarArray.sort((a,b) => a.Date -  b.Date);
    //  this.setTimeCalendarArray(this.timeCalendarArray);
      this.separatingArray(this.timeCalendarArray);
  //    this.setCalendarArray(this.calendarArray);
        });
    }
*/

    createBarChart()
     {

       this.myBarChart= new Chart(this.barChart.nativeElement,{
         type:'bar',
         data:{
           labels: ["Calendar", "Chat Room" , "Home" , "Info Desk" , "Learning Center", "Survey Center"],
           datasets: [{
             label: "Number of Duration in Minutes For Each Page",
             data:this.finalDurationArray,
             backgroundColor: 'rgb(147,112,219)',
             borderColor: 'rgb(147,112,219)',
             borderWidth:1
           }]
         },
         options:{
           scales:{
             yAxes:[{
               ticks:{
                 beginAtZero:true
               }
             }]
           }
         }
       });
       this.myBarChart.update();
     }





    createLineChart()
    {
      this.myLineChart = new Chart(this.lineChart.nativeElement,{
        type:'line',
        data:{
          labels: ["12:00AM", "1:00AM", "2:00AM", "3:00AM" , "4:00AM", "5:00AM" ,
                    "6:00AM", "7:00AM" , "8:00AM" , "9:00AM", "10:00AM" , "11:00AM",
                    "12:00PM", "1:00PM", "2:00PM", "3:00PM" , "4:00PM", "5:00PM" ,
                    "6:00PM", "7:00PM" , "8:00PM" , "9:00PM", "10:00PM" , "11:00PM"],
          datasets: [{
            label: 'Number of Users',
            data: this.timeOfDayArray,
            fill: false,
            borderColor: 'rgb(147,112,219)',
            borderWidth:1
          }
        ]
        },
        options:{
          scales:{
            yAxes:[{
              ticks:{
                beginAtZero:true
              }
            }]
          }
        }
      });
      this.myLineChart.update();

    }


    separatingDurationArray(durationArray)
    {
      this.durationArray = durationArray;
      for(let index = 0; index < this.durationArray.length; index++ )
      {
        if(this.durationArray[index].Page == "calendar")
        {
          this.finalDurationArray[0] += this.durationArray[index].Time;
        }
        if(this.durationArray[index].Page == "chat")
        {
          this.finalDurationArray[1] += this.durationArray[index].Time;
        }
        if(this.durationArray[index].Page == "home")
        {
          this.finalDurationArray[2] += this.durationArray[index].Time;
        }
        if(this.durationArray[index].Page == "infoDesk")
        {
          this.finalDurationArray[3] += this.durationArray[index].Time;
        }
        if(this.durationArray[index].Page == "learningModule")
        {
          this.finalDurationArray[4] += this.durationArray[index].Time;
        }
        if(this.durationArray[index].Page == "survey")
        {
          this.finalDurationArray[5] += this.durationArray[index].Time;
        }

      }



    }



    calculatingDuration(totalTimePageArray)
    {
      this.finalDurationArray= [0,0,0,0,0,0];
      this.totalTimePageArray = totalTimePageArray;

      for(let index = 0; index < this.totalTimePageArray.length-1; index++)
      {

          this.durationHolder = 0 ;
          this.durationHolder = (this.totalTimePageArray[index+1].Time - this.totalTimePageArray[index].Time);
          this.durationHolder =  Math.abs(Math.ceil((this.durationHolder/ 1000)/60 ));

          this.durationArray.push({Time: this.durationHolder, Page: this.totalTimePageArray[index].Page});

      }

      this.separatingDurationArray(this.durationArray);


    }


  calendarAverageCalculation()
  {


    console.log("average array" + this.calendarAverageArray);
    console.log("average array length " + this.calendarAverageArray.length);

    for ( let index = 0; index < this.calendarAverageArray.length; index++)
    {
    //  console.log(this.calendarArray[index]);

      this.calendarAverage =+ this.calendarAverageArray[index];
  //  console.log(this.calendarAverage);

    }

    this.calendarAverage =Math.ceil( this.calendarAverage/this.calendarAverageArray.length );
   console.log("calendar average" +this.calendarAverage);

  }

  setTimeCalendarArray(timeCalendarArray)
  {
    this.timeCalendarArray = timeCalendarArray;
  }
/*
  setCalendarArray(calendarArray)
  {
    this.calendarArray = this.calendarArray;
  }

**/

setTimePageArray(timePageArray)
{
  this.timePageArray = timePageArray;

}

setlogArray(logArray)
{
  this.logArray = logArray;

}


  separatingArray(timeCalendarArray)
  {
    this.timeCalendarArray = timeCalendarArray;
    for(let index = 0; index < this.timeCalendarArray.length; index++ )
    {
      this.calendarNumberHolder.push(this.timeCalendarArray[index].Number);
      this.timestampCalendarHolder.push(this.timeCalendarArray[index].Date.toLocaleString());
    }

    this.setCalendarHolderTimes(this.calendarNumberHolder , this.timestampCalendarHolder);

  }

  setCalendarHolderTimes(calendarNumberHolder, timestampCalendarHolder)
  {
    this.calendarNumberHolder = calendarNumberHolder;
    this.timestampCalendarHolder = timestampCalendarHolder;
  }

  getAllSessions ()
  {
      this.sessions = this.analyticsService.getAllSessions();
  }

  getAllUserPages()
  {
      this.analytics = this.analyticsService.getAllUserPages();
  }



  getUserSessions()
  {

      console.log(this.USERID);

      this.uniqueSessions= this.analyticsService.getUniqueUserStorage(this.USERID);
  }

  getPageViews(id)
  {
      this.analyticsService.getPageViews(id);
  }



  setCalendarAverageArray(calendarAverageArray)
  {
    this.calendarAverageArray = this.calendarAverageArray;
  }


  chatClicksSaver(chatCounter)
  {
     this.chatHolder = this.chatCounter;
    // console.log(this.chatHolder);
  }

  calendarClicksSaver(calendarCounter)
  {
     this.calendarHolder = this.calendarCounter;
  //   console.log(this.calendarHolder);
  }

  moduleClicksSaver(moduleCounter)
  {
     this.moduleHolder = this.moduleCounter;
  //   console.log(this.moduleHolder);
  }

  infoClicksSaver(infoCounter)
  {
     this.infoHolder = this.infoCounter;
  //   console.log(this.infoHolder);
  }

  surveyClicksSaver(surveyCounter)
  {
     this.surveyHolder = this.surveyCounter;
//     console.log(this.surveyHolder);
  }

  profileClicksSaver(profileCounter)
  {
     this.profileHolder = this.profileCounter;
//     console.log(this.profileHolder);
  }

  moreClicksSaver(moreCounter)
  {
     this.moreHolder = this.moreCounter;
//     console.log(this.moreHolder);
  }



}
