import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatsChartComponentComponent } from './vehicle-stats-chart-component.component';

describe('VehicleStatsChartComponentComponent', () => {
  let component: VehicleStatsChartComponentComponent;
  let fixture: ComponentFixture<VehicleStatsChartComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleStatsChartComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleStatsChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
