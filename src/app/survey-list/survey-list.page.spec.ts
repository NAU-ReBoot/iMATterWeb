import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveyListPage } from './survey-list.page';

describe('SurveyListPage', () => {
  let component: SurveyListPage;
  let fixture: ComponentFixture<SurveyListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
