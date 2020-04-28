import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProviderReportPage } from './provider-report.page';

describe('ProviderReportPage', () => {
  let component: ProviderReportPage;
  let fixture: ComponentFixture<ProviderReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
