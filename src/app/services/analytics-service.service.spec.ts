import { TestBed } from '@angular/core/testing';

import { AnalyticsServiceService } from './analytics-service.service';

describe('AnalyticsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticsServiceService = TestBed.get(AnalyticsServiceService);
    expect(service).toBeTruthy();
  });
});
