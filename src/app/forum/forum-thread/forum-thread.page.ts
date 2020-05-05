import { Component, OnInit } from '@angular/core';
import { QuestionService, Question, Comment } from 'src/app/services/infoDesk/question.service';
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
    numOfComments: 0
  };

  comment: Comment = {
    input: '',
    username: '',
    postID: '',
    userID: '',
    timestamp: FieldValue,
    profilePic: '',
    type: '',
    anon: false

  };

  public showCommentBox = false;
  public showSubmitButton = false;


  public comments: Observable<any>;
  // for admin
  public showDeleteOption: boolean;
  // for provider
  public showReportOption: boolean;
  public commentForm: FormGroup;

  constructor(public afs: AngularFirestore,
              public activatedRoute: ActivatedRoute,
              public questionService: QuestionService,
              public toastCtrl: ToastController,
              public router: Router,
              public storage: Storage,
              public alertController: AlertController,
              public formBuilder: FormBuilder) {
    this.commentForm = this.formBuilder.group({
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
      this.comments = this.questionService.getComments(id);
    }

    this.storage.get('type').then((type => {
      if (type) {
        this.comment.type = type;
        if (type === 'admin') {
          this.showDeleteOption = true;
        } else {
          this.showReportOption = true;
        }
      }
    }));
  }

  addComment(commentForm: FormGroup) {
    if (commentForm.valid) {
      let ref;
      this.comment.postID = this.question.id;
      this.comment.input = commentForm.value.comment;
      console.log('in');

      this.storage.get('type').then((val) => {
        if (val) {
          console.log(val);
          this.comment.type = val;
          console.log(this.comment.type);
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
                  this.comment.userID = code;
                  this.comment.username = doc.get('username');
                  this.comment.timestamp = firebase.firestore.FieldValue.serverTimestamp();
                  this.comment.profilePic = doc.get('profilePic');

                  this.questionService.addComment(this.comment).then(() => {
                    this.showToast('Comment added');
                    this.showCommentBox = false;
                    this.showSubmitButton = false;

                  }, err => {
                    this.showToast('There was a problem adding your comment');
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

  displayCommentBox() {
    this.showCommentBox = true;
    this.showSubmitButton = true;
  }

  async reportQuestionOrComment(type, comment, question) {
    let headerMessage = '';
    let messageDetail = '';

    if (type === 'post') {
      headerMessage = 'Report question?';
      messageDetail = 'Are you sure you want to report this question?';
    } else {
      headerMessage = 'Report comment?';
      messageDetail = 'Are you sure you want to report this comment?';
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
                    if (type === 'post') {
                      const providerUsername = doc.get('username');
                      console.log(providerUsername);
                      this.questionService.reportPost(question, providerUsername);
                      this.showToast('Post has been reported');
                    } else {
                      const providerUsername = doc.get('username');
                      this.questionService.reportComment(question, comment, providerUsername);
                      this.showToast('Comment has been reported');
                    }
                  }, err => {
                    this.showToast('There was a problem adding your comment');
                  });
                });
              }
            });

          }}
      ]
    });

    await alert.present();
  }

  deletePost() {

    this.questionService.deleteQuestion(this.question.id);
    this.router.navigate(['/forum/']);
  }

  deleteComment(commentObj, postObj) {
    this.questionService.deleteComment(commentObj.id, commentObj.postID, postObj.numOfComments);
  }

  async deletePostOrComment(type, commentObj, postObj) {
    let headerMessage = '';
    let messageDetail = '';

    if (type === 'post') {
      headerMessage = 'Delete question?';
      messageDetail = 'This will delete question and all comments';
    } else {
      headerMessage = 'Delete comment?';
      messageDetail = 'This will delete only this comment';
    }

    const alert = await this.alertController.create({
      header: headerMessage,
      message: messageDetail,
      buttons: [
        {text: 'Cancel'},
        {text: 'Delete',
          handler: () => {
          if (type === 'post') {
            this.deletePost();
            this.showToast('Post has been deleted');
          } else {
            this.deleteComment(commentObj, postObj);
            this.showToast('Comment has been deleted');
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
