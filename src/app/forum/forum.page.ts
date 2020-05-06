import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Question, QuestionService} from '../services/infoDesk/question.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {

  public questions: Observable<Question[]>;
  public searchbar: any;
  public searchControl: FormControl;
  public items: any;

  public allQuestions: boolean;
  public usersQuestions: boolean;

  public questionList: any[];
  public loadedQuestionList: any[];

  public thisUserQuestionList: any[];
  public thisUserLoadedQuestionList: any[];

  constructor(private questionService: QuestionService,
              private router: Router,
              private storage: Storage,
              private afs: AngularFirestore) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    this.allQuestions = true;
    this.usersQuestions = false;

    this.questions = this.questionService.getQuestions();
    this.getUserQuestions();
    this.getAllQuestions();
  }

  getUserQuestions() {
    this.storage.get('userCode').then((val) => {
      if (val) {
        this.afs.collection('questions', ref => ref.where('commenters', 'array-contains', val).orderBy('timestamp', 'desc'))
            .valueChanges({ idField: 'id' }).subscribe(questionList => {
          this.thisUserQuestionList = questionList;
          this.thisUserLoadedQuestionList = questionList;
        });
      }
    });
  }

  getAllQuestions() {
    this.afs.collection('questions', ref => ref.orderBy('timestamp', 'desc'))
        .valueChanges({ idField: 'id' }).subscribe(questionList => {
      this.questionList = questionList;

      this.loadedQuestionList = questionList;
    });
  }

  initializeItems(): void {
    this.questionList = this.loadedQuestionList;
  }

  initializeUserQuestions(): void {
    this.thisUserQuestionList = this.thisUserLoadedQuestionList;
  }

  filterQuestions(event) {
    console.log('called');
    this.initializeItems();

    const searchInput = event.target.value;

    if (searchInput) {
      this.questionList = this.questionList.filter(currentQuestion => {
        return(currentQuestion.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1);
      });
    }
  }

  filterUserQuestions(event) {
    console.log('called');
    this.initializeUserQuestions();

    const searchInput = event.target.value;

    if (searchInput) {
      this.thisUserQuestionList = this.thisUserQuestionList.filter(currentQuestion => {
        return(currentQuestion.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1);
      });
    }
  }

}
