import { Component, OnInit } from '@angular/core';
import { QuestionService, Question, Answer } from 'src/app/services/infoDesk/question.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forum-thread',
  templateUrl: './forum-thread.page.html',
  styleUrls: ['./forum-thread.page.scss'],
})
export class ForumThreadPage implements OnInit {

  question: Question = {
    title: '',
    description: '',
    username: '',
    userID: '',
    timestamp: FieldValue,
    profilePic: '',
    anon: false,
    numOfAnswers: 0,
  };

  answer: Answer = {
    input: '',
    username: '',
    questionID: '',
    userID: '',
    timestamp: FieldValue,
    profilePic: '',
    type: '',
    anon: false

  };

  public showAnswerBox = false;
  public showSubmitButton = false;


  public answers: Observable<any>;
  // for admin
  public showDeleteOption: boolean;
  // for provider
  public showReportOption: boolean;
  public answerForm: FormGroup;

  constructor(public afs: AngularFirestore,
              public activatedRoute: ActivatedRoute,
              public questionService: QuestionService,
              public toastCtrl: ToastController,
              public router: Router,
              public storage: Storage,
              public alertController: AlertController,
              public formBuilder: FormBuilder) {
    this.answerForm = this.formBuilder.group({
      comment: ['',
        Validators.compose([Validators.required, Validators.minLength(1)])],
    });
  }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.questionService.getQuestion(id).subscribe(question => {
        this.question = question;
      });
      this.answers = this.questionService.getAnswers(id);
    }

    this.storage.get('type').then((type => {
      if (type) {
        this.answer.type = type;
        if (type === 'admin') {
          this.showDeleteOption = true;
        } else {
          this.showReportOption = true;
        }
      }
    }));
  }

  addAnswer(answerForm: FormGroup) {
    if (answerForm.valid) {
      let ref;
      this.answer.questionID = this.question.id;
      this.answer.input = answerForm.value.comment;
      console.log('in');

      this.storage.get('type').then((val) => {
        if (val) {
          console.log(val);
          this.answer.type = val;
          console.log(this.answer.type);
          if (val === 'admin') {
            ref = this.afs.firestore.collection('admins');
          } else {
            ref = this.afs.firestore.collection('providers');
            console.log('provider');
          }

          this.storage.get('userCode').then((code) => {
            if (code) {
              ref = ref.where('code', '==', code);
              ref.get().then((result) => {
                result.forEach(doc => {
                  this.answer.userID = code;
                  this.answer.username = doc.get('username');
                  this.answer.timestamp = firebase.firestore.FieldValue.serverTimestamp();
                  this.answer.profilePic = doc.get('profilePic');

                  this.questionService.addAnswer(this.answer).then(() => {
                    this.showToast('Answer added');
                    this.showAnswerBox = false;
                    this.showSubmitButton = false;
                    this.answerForm.reset();

                  }, err => {
                    this.showToast('There was a problem adding your answer');
                  });

                });
              });
            }
          });
        }
      });
    }
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  displayAnswerBox() {
    this.showAnswerBox = true;
    this.showSubmitButton = true;
  }

  async reportQuestionOrAnswer(type, answer, question) {
    let headerMessage = '';
    let messageDetail = '';

    if (type === 'question') {
      headerMessage = 'Report question?';
      messageDetail = 'Are you sure you want to report this question?';
    } else {
      headerMessage = 'Report answer?';
      messageDetail = 'Are you sure you want to report this answer?';
    }

    const alert = await this.alertController.create({
      header: headerMessage,
      message: messageDetail,
      buttons: [
        {text: 'Cancel'},
        {text: 'Report',
          handler: () => {
            this.storage.get('userCode').then((code) => {
              if (code) {
                this.afs.firestore.collection('providers').where('code', '==', code).get().then((result) => {
                  result.forEach(doc => {
                    if (type === 'question') {
                      const providerUsername = doc.get('username');
                      console.log(providerUsername);
                      this.questionService.reportQuestion(question, providerUsername);
                      this.showToast('Question has been reported');
                    } else {
                      const providerUsername = doc.get('username');
                      this.questionService.reportAnswer(question, answer, providerUsername);
                      this.showToast('Answer has been reported');
                    }
                  }, err => {
                    this.showToast('There was a problem reporting the answer');
                  });
                });
              }
            });

          }}
      ]
    });

    await alert.present();
  }

  deleteQuestion() {

    this.questionService.deleteQuestion(this.question.id).then(() => {
      this.showToast('Question has been deleted');
    });
    this.router.navigate(['/forum/']);
  }

  deleteAnswer(answerObj, QuestionObj) {
    this.questionService.deleteAnswer(answerObj, answerObj.questionID, QuestionObj).then(() => {
      this.showToast('Answer has been deleted');
    });
  }

  async deleteQuestionOrAnswer(type, answerObj, QuestionObj) {
    let headerMessage = '';
    let messageDetail = '';

    if (type === 'question') {
      headerMessage = 'Delete Question?';
      messageDetail = 'This will delete question and all answers';
    } else {
      headerMessage = 'Delete Answer?';
      messageDetail = 'This will delete only this answer';
    }

    const alert = await this.alertController.create({
      header: headerMessage,
      message: messageDetail,
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
          if (type === 'question') {
            this.deleteQuestion();
          } else {
            this.deleteAnswer(answerObj, QuestionObj);
          }
          }}
      ]
    });

    await alert.present();
  }

  goToProfile(userID: string, questionID: string) {
    this.router.navigate(['/viewable-profile/', userID]);
    this.storage.set('currentPost', questionID);
  }




}
