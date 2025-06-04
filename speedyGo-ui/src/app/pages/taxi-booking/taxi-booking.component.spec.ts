import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiBookingComponent } from './taxi-booking.component';

describe('TaxiBookingComponent', () => {
  let component: TaxiBookingComponent;
  let fixture: ComponentFixture<TaxiBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
