import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatAvgDurationMinutesComponent } from './stat-avg-duration-minutes.component';

describe('StatAvgDurationMinutesComponent', () => {
  let component: StatAvgDurationMinutesComponent;
  let fixture: ComponentFixture<StatAvgDurationMinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatAvgDurationMinutesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatAvgDurationMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
