import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChallengeTypesPage } from './challengeTypes.page';

describe('ChallengeTypesPage', () => {
    let component: ChallengeTypesPage;
    let fixture: ComponentFixture<ChallengeTypesPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ChallengeTypesPage ],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ChallengeTypesPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
