import { Component, OnInit } from '@angular/core';
import { Question } from '../../services/learning-module.service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-quiz-question',
  templateUrl: './add-quiz-question.page.html',
  styleUrls: ['./add-quiz-question.page.scss'],
})
export class AddQuizQuestionPage implements OnInit {

  public quizForm: FormGroup;

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

  constructor(
    private modalController: ModalController, 
    private router: Router, 
    private storage: Storage,
    private formBuilder: FormBuilder) 
    {
      this.quizForm = this.formBuilder.group({
        questionText: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        pointsWorth: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('[0-9]+([0-9]+)*')])],
        choice1: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        choice2: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        choice3: [''],
        choice4: [''],
        correctAnswer: ['', Validators.compose([Validators.required])],
      });
    }

  ngOnInit() {

    this.quizForm.patchValue(this.quizQuestion);

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

  }

  async closeModal() {
    //Pass the updated quizQuestion object back after we're done here
    await this.modalController.dismiss(this.quizForm.value);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
