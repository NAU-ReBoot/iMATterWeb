import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProviderInboxPage } from './provider-inbox.page';

describe('ProviderInboxPage', () => {
  let component: ProviderInboxPage;
  let fixture: ComponentFixture<ProviderInboxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderInboxPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderInboxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
