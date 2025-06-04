import { TestBed } from '@angular/core/testing';

import { SafetyContentService } from './safety-content.service';

describe('SafetyContentService', () => {
  let service: SafetyContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafetyContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
