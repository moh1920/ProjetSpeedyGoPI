import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatMaintenanceVehicleComponent } from './stat-maintenance-vehicle.component';

describe('StatMaintenanceVehicleComponent', () => {
  let component: StatMaintenanceVehicleComponent;
  let fixture: ComponentFixture<StatMaintenanceVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatMaintenanceVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatMaintenanceVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
