import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCarpoolComponent } from './reservation-carpool.component';

describe('ReservationCarpoolComponent', () => {
  let component: ReservationCarpoolComponent;
  let fixture: ComponentFixture<ReservationCarpoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCarpoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCarpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
