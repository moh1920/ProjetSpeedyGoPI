import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRentalVehicleComponent } from './add-rental-vehicle.component';

describe('AddRentalVehicleComponent', () => {
  let component: AddRentalVehicleComponent;
  let fixture: ComponentFixture<AddRentalVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRentalVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRentalVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
