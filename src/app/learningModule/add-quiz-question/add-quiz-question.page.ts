import { Component, OnInit } from '@angular/core';
import { Question } from '../../services/learning-module.service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-quiz-question',
  templateUrl: './add-quiz-question.page.html',
  styleUrls: ['./add-quiz-question.page.scss'],
})
export class AddQuizQuestionPage implements OnInit {

  quizQuestion: Question =
  {
    questionText: '',
    choice1: '',
    choice2: '',
    choice3: '',
    choice4: '',
    correctAnswer: '',
    pointsWorth: 0
  }

  constructor(private modalController: ModalController, private router: Router, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);
      }
    });

  }

  async closeModal() {
    //Pass the updated quizQuestion object back after we're done here
    await this.modalController.dismiss(this.quizQuestion);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
