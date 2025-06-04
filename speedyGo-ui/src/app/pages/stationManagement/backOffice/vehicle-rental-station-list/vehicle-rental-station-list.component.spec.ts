import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRentalStationListComponent } from './vehicle-rental-station-list.component';

describe('VehicleRentalStationListComponent', () => {
  let component: VehicleRentalStationListComponent;
  let fixture: ComponentFixture<VehicleRentalStationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleRentalStationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleRentalStationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
