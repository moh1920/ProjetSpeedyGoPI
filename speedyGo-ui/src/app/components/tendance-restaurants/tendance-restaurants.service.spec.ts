import { TestBed } from '@angular/core/testing';

import { TendanceRestaurantsService } from './tendance-restaurants.service';

describe('TendanceRestaurantsService', () => {
  let service: TendanceRestaurantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TendanceRestaurantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
