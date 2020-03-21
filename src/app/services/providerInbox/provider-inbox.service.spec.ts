import { TestBed } from '@angular/core/testing';

import { ProviderInboxService } from './provider-inbox.service';

describe('ProviderInboxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProviderInboxService = TestBed.get(ProviderInboxService);
    expect(service).toBeTruthy();
  });
});
