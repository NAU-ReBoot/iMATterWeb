import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Question, QuestionService} from '../services/infoDesk/question.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {

  private questions: Observable<Question[]>;

  constructor(private questionService: QuestionService, private router: Router, private storage: Storage) {
  }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

    this.questions = this.questionService.getQuestions();
  }

}
