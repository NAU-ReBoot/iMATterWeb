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


// am and pm values
    public timeOfDayArray: any = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    public timeLabelArray: any = [];
    public pageString: string;


    public sessionIDHolder: any;
    public sessionDocument : any;
    public loginTimeData: any;
    public logoutTimeData: any;
    public quantityCalculation: any;
    public beginningOfSessionIndex: number;





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
    }


    ionViewWillEnter()
    {
      this.getAllTotalClicks();
      this.durationPage = false;
    }

    ionViewDidEnter()
    {
      this.pageStatistics = true;
      this.durationPage = false;
      this.durationSubmitted = false;
    }

    pageStatsOff ()
    {
      this.pageStatistics = false;
      this.submitted = false;
      this.durationPage = true;
      this.createBarChart();

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

    getMeasures()
    {
      console.log("start date " + this.startDate);
      console.log("end date " + this.endDate);
      this.beginningOfSessionIndex = 0;
      this.calendarAverageArray = new Array();

      this.startDate = new Date(this.startDate);
      this.startDate.setHours(0);
      this.startDate.setMinutes(0);
      this.startDate.setMilliseconds(0);
      this.startDate.setSeconds(0);

      this.endDate = new Date(this.endDate);
      this.endDate.setHours(0);
      this.endDate.setMinutes(0);
      this.endDate.setMilliseconds(0);
      this.endDate.setSeconds(0);

      this.dayDifference = this.endDate.getDate() - this.startDate.getDate();

          let ref = this.afs.firestore.collection("analyticsStorage");
          ref.where('timestamp', '>=', this.startDate ).where('timestamp', '<=', this.endDate)
              .get().then((result) =>{




                result.forEach(doc =>{
                  // get the page of the storage
                  this.currentView = doc.get("page");
                  this.currentTime = doc.get("timestamp");

                  this.currentTime = new Date(this.currentTime.toDate());
                  this.currentTime = this.currentTime.getTime();
                  this.epochArray.push(this.currentTime);
                  this.pageviewArray.push(this.currentView);


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

                    this.sessionIDHolder = doc.get("sessionID");
                    console.log(this.sessionIDHolder);



                    this.sessionDocument = this.afs.firestore.collection("analyticsSessions")
                    .doc(this.sessionIDHolder).get().then((doc) =>{

                      ``// log in time
                        this.loginTimeData = doc.get("LoginTime");

                        this.loginTimeData = new Date (this.loginTimeData.toDate());
                        this.loginTimeData = this.loginTimeData.getTime();


                        // log out time
                        this.logoutTimeData= doc.get("LogOutTime");

                        this.logoutTimeData = new Date (this.logoutTimeData.toDate());
                        this.logoutTimeData = this.logoutTimeData.getTime();

                        this.quantityCalculation = doc.get("numOfClickChat") +
                                    doc.get("numOfClickCalendar")+ doc.get("numOfClickLModule") + doc.get("numOfClickInfo")
                                    + doc.get("numOfClickSurvey") + doc.get("numOfClickProfile")+ doc.get("numOfClickHome")
                                   + doc.get("numOfClickMore") + doc.get("numOfClickProfile");
                        console.log(this.quantityCalculation);

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


                });



                  }

                });

                this.calendarAverageCalculation(this.calendarAverageArray);

                this.savingTimeOfDayArray(this.timeOfDayArray);
                this.createLineChart();
                this.timeOfDayArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
              });
    }

    savingTimeOfDayArray(timeOfDayArray)
    {
      this.timeOfDayArray = timeOfDayArray;
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
      console.log(this.yesterday);

      this.todayMinusOne = this.yesterday.toISOString().substr(0.10);

    }


    minEndDate()
    {
      this.minStartToEnd = this.startDate;
      console.log(this.minStartToEnd);

      this.maxStartToEnd = this.today.toISOString().substr(0.10);
      console.log(this.maxStartToEnd);

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


    createBarChart()
     {

       this.myBarChart= new Chart(this.barChart.nativeElement,{
         type:'bar',
         data:{
           labels: ["Calendar", "Chat Room" , "Home" , "Info Desk" , "Learning Center", "Survey Center"],
           datasets: [{
             label: "Number of Time Notifications is Clicked",
             data:[2.5, 3.8, 2, 6.9, 6.9, 7, 10, 0],
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


  calculatingDuration(epochArray, pageviewArray)
  {
    this.epochArray = epochArray;
    this.pageviewArray = pageviewArray;

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


  calendarAverageCalculation(calendarAverageArray)
  {
    this.calendarAverageArray = calendarAverageArray;
    for ( let index = 0; index < this.calendarAverageArray.length; index++)
    {
    //  console.log(this.calendarArray[index]);

      this.calendarAverage =+ this.calendarAverageArray[index];
  //  console.log(this.calendarAverage);

    }

    this.calendarAverage =Math.ceil( this.calendarAverage/this.calendarAverageArray.length );
  //  console.log(this.calendarAverage);

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
