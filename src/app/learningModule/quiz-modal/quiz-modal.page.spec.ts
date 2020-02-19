import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizModalPage } from './quiz-modal.page';

describe('QuizModalPage', () => {
  let component: QuizModalPage;
  let fixture: ComponentFixture<QuizModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
