import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStationVehicleComponent } from './form-station-vehicle.component';

describe('FormStationVehicleComponent', () => {
  let component: FormStationVehicleComponent;
  let fixture: ComponentFixture<FormStationVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStationVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStationVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
