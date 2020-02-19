import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalSingleChoicePage } from './modal-single-choice.page';

describe('ModalSingleChoicePage', () => {
  let component: ModalSingleChoicePage;
  let fixture: ComponentFixture<ModalSingleChoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSingleChoicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSingleChoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
