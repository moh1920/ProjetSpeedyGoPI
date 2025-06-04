import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsVehicleRentalComponent } from './details-vehicle-rental.component';

describe('DetailsVehicleRentalComponent', () => {
  let component: DetailsVehicleRentalComponent;
  let fixture: ComponentFixture<DetailsVehicleRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsVehicleRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsVehicleRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
