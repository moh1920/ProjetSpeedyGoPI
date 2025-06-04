import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStationVehicleComponent } from './update-station-vehicle.component';

describe('UpdateStationVehicleComponent', () => {
  let component: UpdateStationVehicleComponent;
  let fixture: ComponentFixture<UpdateStationVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStationVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStationVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
