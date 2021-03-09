import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewChallengePage } from './newChallenge.page';

describe('EditChallengePage', () => {
    let component: NewChallengePage;
    let fixture: ComponentFixture<NewChallengePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NewChallengePage ],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(NewChallengePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
