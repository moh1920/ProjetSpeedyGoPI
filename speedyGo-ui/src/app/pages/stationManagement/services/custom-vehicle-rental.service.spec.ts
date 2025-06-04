import { TestBed } from '@angular/core/testing';

import { CustomVehicleRentalService } from './custom-vehicle-rental.service';

describe('CustomVehicleRentalService', () => {
  let service: CustomVehicleRentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomVehicleRentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
