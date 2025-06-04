import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVehicleRentalComponent } from './form-vehicle-rental.component';

describe('FormVehicleRentalComponent', () => {
  let component: FormVehicleRentalComponent;
  let fixture: ComponentFixture<FormVehicleRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormVehicleRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormVehicleRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
