import { TestBed } from '@angular/core/testing';

import { MobileSettingsService } from './mobile-settings.service';

describe('MobileSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MobileSettingsService = TestBed.get(MobileSettingsService);
    expect(service).toBeTruthy();
  });
});
