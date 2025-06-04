import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalVehicleListComponent } from './rental-vehicle-list.component';

describe('RentalVehicleListComponent', () => {
  let component: RentalVehicleListComponent;
  let fixture: ComponentFixture<RentalVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalVehicleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
