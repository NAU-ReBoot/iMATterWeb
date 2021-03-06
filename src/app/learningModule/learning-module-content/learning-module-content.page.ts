import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningModuleService, LearningModule, Question } from '../../services/learning-module.service';
import { ToastController } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { QuizModalPage } from '../quiz-modal/quiz-modal.page';
import { AddQuizQuestionPage } from '../add-quiz-question/add-quiz-question.page';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-learning-module-content',
  templateUrl: './learning-module-content.page.html',
  styleUrls: ['./learning-module-content.page.scss'],
})
export class LearningModuleContentPage implements OnInit {

  public learningModules: Observable<LearningModule[]>;
  public learningModuleForm: FormGroup;

  learningModule: LearningModule = 
  {
    moduleTitle: '',
    moduleDescription: '',
    moduleContent: '',
    moduleVideoID: '',
    modulePPTurl: '',
    moduleVisibilityTime: '',
    moduleExpiration: 0,
    moduleActive: false,
    moduleQuiz: [],
    modulePointsWorth: 0,
    moduleNext: '',
    userVisibility: [],
    previousUserVisibility: []
  }

  quizQuestions: Question =
  {
    questionText: '',
    choice1: '',
    choice2: '',
    choice3: '',
    choice4: '',
    correctAnswer: '',
    pointsWorth: 0
  }

  sanitizedVideoURL: SafeResourceUrl;
  sanitizedPPTurl: SafeResourceUrl;
  moduleVideoURL = "https://www.youtube.com/embed/";

  //Question returned from the modal to add questions
  dataReturned:Question;
  //Question that needs to be deleted
  questionToDelete:string;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private learningModuleService: LearningModuleService, 
    private router: Router, 
    private toastCtrl: ToastController, 
    public domSanitizer: DomSanitizer,
    public modalController: ModalController,
    public alertController: AlertController,
    private storage: Storage,
    private formBuilder: FormBuilder) 
    {
      this.learningModuleForm = this.formBuilder.group({
        moduleTitle: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        moduleDescription: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        moduleVisibilityTime: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('^(0|([1-9][0-9]*,[ ])*[1-9][0-9]*)')])],
        moduleExpiration: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('^(0|[1-9][0-9]*)$')])],
        moduleContent: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        moduleVideoID: [''],
        modulePPTurl: [''],
        moduleNext: [''],
        moduleQuiz: [],
        modulePointsWorth: [''],
        moduleActive: [''],
        userVisibility: [''],
        previousUserVisibility: ['']
      });
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

    this.learningModules = this.learningModuleService.getAllLearningModules();

  }

  ionViewWillEnter()
  {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id)
    {
      this.learningModuleService.getLearningModule(id).subscribe(learningModule => {
        this.learningModule = learningModule;
        
        this.learningModuleForm.patchValue(this.learningModule);

        //If there is a youtube video id
        if (learningModule.moduleVideoID != '')
        {
          //Put together the URL for this learning module's video
          this.moduleVideoURL = this.moduleVideoURL + learningModule.moduleVideoID;
          //In order to display the video, the URL needs to be sanitized or else the browser will think it's a security issue
          this.sanitizedVideoURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.moduleVideoURL);
        }

        //If there is a PPT URL
        if (learningModule.modulePPTurl != '')
        {
          this.sanitizedPPTurl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.learningModule.modulePPTurl);
        }

        //Calculate 
        this.calculatePointsWorth();
      });
      this.learningModule.id = id; //this line is important!! attaches the ID to the learning module so the content for that LM shows up
      //this.calculatePointsWorth();
    }
    else
    {
      //this.learningModule.id = id;
      this.learningModuleForm.patchValue(this.learningModule);
    }

  }

  addLearningModule()
  {
    if (this.learningModuleForm.status === 'VALID')
    {
      var newData = this.learningModuleForm.value;

      this.learningModuleService.addLearningModule(newData).then(() => {
        this.router.navigateByUrl('/learningmodules');
        this.showToast('Learning module added');
      }, err => {
        this.showToast('There was a problem adding your learning module.');
      });

    }
  }

  updateLearningModule()
  {
    if (this.learningModuleForm.status == 'VALID')
    { 
      //IMPORTANT: need to pass in this LM's ID when updating
      this.learningModuleForm.addControl('id', this.formBuilder.control(this.learningModule.id));

      var newData = this.learningModuleForm.value;

      this.learningModuleService.updateLearningModule(newData).then(() => 
      {
        this.showToast('Learning module updated!');
      });
    }

  }

  silentlyUpdateLearningModule()
  {
    if (this.learningModuleForm.status == 'VALID')
    { 
      //IMPORTANT: need to pass in this LM's ID when updating
      this.learningModuleForm.addControl('id', this.formBuilder.control(this.learningModule.id));

      var newData = this.learningModuleForm.value;

      this.learningModuleService.updateLearningModule(newData).then(() => 
      {
        console.log("silently updated learning module");
      });
    }
  }


  deleteLearningModule() 
  {
    this.learningModuleService.deleteLearningModule(this.learningModule.id).then(() => {
      this.router.navigateByUrl('/learningmodules');
      this.showToast('Learning module deleted!');
    }, err => {
      this.showToast('There was a problem deleting your learning module.');
    });
  }

  showToast(msg:string)
  {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  /**
   * Open a question in a modal for viewing (no editing capabilities)
   */
  async openQuestion(quizQuestion:Question) 
  {
    const modal = await this.modalController.create({
      component: QuizModalPage,
      componentProps:
      {
        currentLearningModule: this.learningModuleForm.value,
        learningModuleID: this.learningModule.id,
        currentQuizQuestion: quizQuestion
      }
    });

    modal.onDidDismiss().then((responseToHandle) => {

      if (responseToHandle.data == undefined)
      {
        console.log("undefined");
      }
      else
      {
        var event = responseToHandle.data.get("event");
        var content = responseToHandle.data.get("content");

        if (event == "update")
        {
          this.learningModuleForm.patchValue({moduleQuiz: content});
          this.learningModule.moduleQuiz = content;

          //Recalculate and update the number of points this learning module is worth
          this.calculatePointsWorth();
        }
        else if(event == "delete")
        {
          this.deleteQuestion(content);
        }
      }
    });
    
    return await modal.present();
  }

  /**
   * Add a new question to the quiz
   */
  async addQuestion()
  {
    const modal = await this.modalController.create({
      component: AddQuizQuestionPage
    });

    //After modal is dismissed, check to see that something legitimate was returned
    modal.onDidDismiss().then((dataReturned) => {
      //dataReturned.data.dismissed == means the "cancel" button was pressed
      //dataReturned.data.questionText == '' means they didn't input text for the question
      //in either of these cases, we won't bother pushing to database
      if (dataReturned.data.dismissed != true && dataReturned.data.questionText != '') 
      {
        //append new question to moduleQuiz array
        this.learningModule.moduleQuiz.push(dataReturned.data);

        //in the case we're adding a new module that doesn't have an ID yet
        if (this.learningModule.id != null || this.learningModule.id != undefined)
        {
          //Update the learning module to reflect changes in database
          this.updateLearningModule();
        }
        
        //Recalculate and update the number of points this learning module is worth
        this.calculatePointsWorth();
      }
      else if (dataReturned.data == undefined)
      {
        console.log("clicked out of add question");
      }
    });
    return await modal.present();
  }

  /**
   * Delete a given question from learningModule.moduleQuiz
   * Used to delete something passed back from quiz-modal
   * @param text The text of the question to be deleted
   */
  deleteQuestion(text:string)
  {
    //iterate through the questions until you find the question
     for (var index=0; index < this.learningModule.moduleQuiz.length; index++)
     {
       //if the question is found
       if (this.learningModule.moduleQuiz[index].questionText == text)
       {
         //starting at the index of the found question, remove one element (the question)
          this.learningModule.moduleQuiz.splice(index, 1);
       }
     }

     //if we're not adding a new module (where there's no ID yet)
    if (this.learningModule.id != null || this.learningModule.id != undefined)
    {
      //update the learning module
      this.updateLearningModule();
    }

     //Recalculate and update the number of points learning module is worth
     this.calculatePointsWorth();
  }

  async deleteModuleConfirmation() {
    const alert = await this.alertController.create({
      header: 'Delete Learning Module?',
      message: 'Are you sure you want to delete this learning module?',
      buttons: [
        {text: 'Cancel'}, 
        {text: 'Delete',
        handler: () => {
          this.deleteLearningModule();
        }}
      ]
    });

    await alert.present();
  }

  /**
   * Iterate through the quiz questions and add up their points to return
   * the number of total points this module is worth
   */
  calculatePointsWorth()
  {
    var totalPoints = 0;
    this.learningModule.moduleQuiz.forEach(element => {
      totalPoints += Number(element.pointsWorth);
    });

    this.learningModule.modulePointsWorth = totalPoints;
    this.learningModuleForm.patchValue({modulePointsWorth: totalPoints});

    //if we're not adding a new module (where there's no ID yet)
    if (this.learningModule.id != null || this.learningModule.id != undefined)
    {
      this.silentlyUpdateLearningModule();
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
          header,
          message,
          buttons: ['OK']
      });

    await alert.present();
  }

  displayHelpInfo()
  {
    this.presentAlert('About Learning Module Fields',
    '<b>Display Module During Weeks:</b> ' +
      'A comma separated list of the weeks of pregnancy this learning module should start being displayed to users. ' +
        ' <br>Example: 14, 20, 26, 35 <br><br>' + 
    '<b>Days Visible Before Expiration:</b> ' + 
      'The number of days after appearing that this module should expire. <br><br>' +
    '<b>Module Contents:</b> ' +
      'Text that will be displayed inside a learning module above the module media. <br><br>' +
    '<b>Next Module:</b> ' +
      'After watching a video/powerpoint and taking the quiz, users will be shown a button that takes them to this designated module.');
  }
}
