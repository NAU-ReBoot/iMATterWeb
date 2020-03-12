import { Component, ViewChild, OnInit } from '@angular/core';
import  Chart  from "chart.js";
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map, take } from 'rxjs/operators';
import { IonContent } from '@ionic/angular';
import { AnalyticsService, Analytics, Sessions, UniqueSessions} from '../services/analytics-service.service';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.page.html',
    styleUrls: ['./analytics.page.scss'],
})

export class AnalyticsPage {
//@ViewChild('barChart', {static: true}) barChart;

@ViewChild('lineChart', {static: true}) lineChart;
//  @ViewChild('content', {static: true}) content: IonContent;

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

    public calendarView = false;
    public indivUserView = false;

    public currentView : string;
    public currentTime: any;
    public epochArray: any = [];
    public pageviewArray: any =[];
    public durationHolder: any;
    public durationArray: { Time: any, Page: string }[] =[];

    private analyticss : string;
    private sessions : Observable<any>;
    private analytics: Observable<any>;
    private uniqueSessions: Observable<any>;




    constructor(
    //    private storage: Storage,
        public afs: AngularFirestore,
        private analyticsService: AnalyticsService
    ) {
        this.db = firebase.firestore();
    }


    ionViewWillEnter()
    {
      this.getAllTotalClicks();
    }


    ngOnInit() {


      this.indivUserView= true;
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

          this.calculatingDuration(this.epochArray, this.pageviewArray);
          });
    }



    calculatingDuration(epochArray, pageviewArray)
    {
      this.epochArray = epochArray;
      this.pageviewArray = pageviewArray;
      console.log(this.epochArray);
      console.log(this.pageviewArray);

      for(let index = 0; index < this.epochArray.length; index++)
      {
        if(index !== 0)
        {
          //  Math.round((timeStart.getTime() - (new Date()).getTime()) / 1000)
          this.durationHolder = (this.epochArray[index+1] - this.epochArray[index]);
          this.durationHolder =  Math.abs(Math.ceil((this.durationHolder/ 1000)/60 ));
          this.durationArray.push({Time: this.durationHolder, Page: this.pageviewArray[index]});
        }
        else
        {
          this.durationArray.push({ Time: 0 , Page : this.pageviewArray[index]});
        }
      }

      console.log(this.durationArray);
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
          this.moduleCounter = this.moduleCounter + doc.get("numOfClickLModule");
          this.infoCounter = this.infoCounter + doc.get("numOfClickInfo");
          this.surveyCounter = this.surveyCounter + doc.get("numOfClickSurvey");
          this.profileCounter = this.profileCounter + doc.get("numOfClickProfile");
          this.moreCounter = this.moreCounter + doc.get("numOfClickMore");



      });

      this.chatClicksSaver( this.chatCounter);
      this.calendarClicksSaver(this.calendarCounter);
      console.log(this.calendarCounter);
      this.moduleClicksSaver(this.moduleCounter);
      this.infoClicksSaver(this.infoCounter);
      this.surveyClicksSaver(this.surveyCounter);
      this.profileClicksSaver(this.profileCounter);
      this.moreClicksSaver(this.moreCounter);
        });
    }


  createLineChart()
  {
    this.myLineChart = new Chart(this.lineChart.nativeElement,{
      type:'line',
      data:{
        labels:[ "test1" , "test2" , "test3" , "test4","test5" , "test6", "test7", "test8"],
        datasets: [{
          label: "Chart Tester",
          data:[2.5, 5, 5, 10, 6.9, 7.5, 10, 0],
          fill: false,
          borderColor: 'rgb(38, 147, 194)',
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





  totalCalendarInfo()
  {

    this.calendarView = true;
    this.indivUserView = false;
    this.createLineChart();
//    this.myLineChart.update();

  }

  userInformation()
  {
    this.indivUserView = true;
    this.calendarView = false;

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
