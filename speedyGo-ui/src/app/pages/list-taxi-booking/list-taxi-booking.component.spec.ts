import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTaxiBookingComponent } from './list-taxi-booking.component';

describe('ListTaxiBookingComponent', () => {
  let component: ListTaxiBookingComponent;
  let fixture: ComponentFixture<ListTaxiBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTaxiBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTaxiBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
