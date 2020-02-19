import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatCohortListPage } from './chat-cohort-list.page';

describe('ChatCohortListPage', () => {
  let component: ChatCohortListPage;
  let fixture: ComponentFixture<ChatCohortListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatCohortListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatCohortListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
