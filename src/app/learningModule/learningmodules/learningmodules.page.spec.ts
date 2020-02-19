import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LearningmodulesPage } from './learningmodules.page';

describe('LearningmodulesPage', () => {
  let component: LearningmodulesPage;
  let fixture: ComponentFixture<LearningmodulesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningmodulesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LearningmodulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
