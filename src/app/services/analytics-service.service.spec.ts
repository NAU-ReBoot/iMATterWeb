import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics-service.service';

describe('AnalyticsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticsService = TestBed.get(AnalyticsService);
    expect(service).toBeTruthy();
  });
});
