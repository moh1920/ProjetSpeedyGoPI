import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationVehicleListComponent } from './station-vehicle-list.component';

describe('StationVehicleListComponent', () => {
  let component: StationVehicleListComponent;
  let fixture: ComponentFixture<StationVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationVehicleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
