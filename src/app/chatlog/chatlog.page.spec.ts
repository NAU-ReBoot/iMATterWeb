import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatlogPage } from './chatlog.page';

describe('ChatlogPage', () => {
  let component: ChatlogPage;
  let fixture: ComponentFixture<ChatlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatlogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
