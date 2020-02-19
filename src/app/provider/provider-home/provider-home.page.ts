import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../../services/infoDesk/question.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-home',
  templateUrl: './provider-home.page.html',
  styleUrls: ['./provider-home.page.scss'],
})
export class ProviderHomePage implements OnInit {

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

