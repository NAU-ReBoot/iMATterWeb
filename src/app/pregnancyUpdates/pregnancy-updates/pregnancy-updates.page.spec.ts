import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PregnancyUpdatesPage } from './pregnancy-updates.page';

describe('PregnancyUpdatesPage', () => {
  let component: PregnancyUpdatesPage;
  let fixture: ComponentFixture<PregnancyUpdatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregnancyUpdatesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PregnancyUpdatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
