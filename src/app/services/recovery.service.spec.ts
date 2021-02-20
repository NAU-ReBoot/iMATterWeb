import { TestBed } from '@angular/core/testing';

import { RecoveryEmailService } from './recovery.service';

describe('RecoveryEmailService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: RecoveryEmailService = TestBed.get(RecoveryEmailService);
        expect(service).toBeTruthy();
    });
});
