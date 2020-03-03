import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileSettingsPage } from './mobile-settings.page';

describe('MobileSettingsPage', () => {
  let component: MobileSettingsPage;
  let fixture: ComponentFixture<MobileSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileSettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
