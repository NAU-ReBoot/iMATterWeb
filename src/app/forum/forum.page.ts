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

  private questions: Observable<Question[]>;
  private searchbar: any;
  public searchControl: FormControl;
  public items: any;

  public questionList: any[];
  public loadedQuestionList: any[];

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

      this.afs.collection('questions', ref => ref.orderBy('timestamp', 'desc'))
          .valueChanges({ idField: 'id' }).subscribe(questionList => {
            this.questionList = questionList;
            console.log(this.questionList);
            this.loadedQuestionList = questionList;
          });
    });

    this.questions = this.questionService.getQuestions();
  }

  initializeItems(): void {
    this.questionList = this.loadedQuestionList;
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

}
