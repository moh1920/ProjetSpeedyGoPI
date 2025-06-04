import { TestBed } from '@angular/core/testing';

import { VehicleRentalServiceService } from './vehicle-rental-service.service';

describe('VehicleRentalServiceService', () => {
  let service: VehicleRentalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleRentalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
