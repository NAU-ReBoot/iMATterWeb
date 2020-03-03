import { Component, OnInit } from '@angular/core';
import { QuestionService, Question, Comment } from 'src/app/services/infoDesk/question.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;

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
    anon: false
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

  public showCommentBox: boolean = false;

  private comments: Observable<any>;
  private showDeleteOption: boolean;

  constructor(private afs: AngularFirestore,
              private activatedRoute: ActivatedRoute, private questionService: QuestionService,
              private toastCtrl: ToastController, private router: Router, private storage: Storage) { }

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
        }
      }
    }));
  }

  addComment() {
    let ref;
    this.comment.postID = this.question.id;
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

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  displayCommentBox() {
    this.showCommentBox = true;
  }

  deletePost() {

    this.questionService.deleteQuestion(this.question.id);
    this.router.navigate(['/forum/']);
  }

  deleteComment(commentID) {
    this.questionService.deleteComment(commentID);
  }

  refreshPost() {

  }

  goToProfile(userID: string, questionID: string) {
    this.router.navigate(['/viewable-profile/', userID]);
    this.storage.set('currentPost', questionID);
  }
}
