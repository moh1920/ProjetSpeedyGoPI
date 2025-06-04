import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRentalScooterComponent } from './home-rental-scooter.component';

describe('HomeRentalScooterComponent', () => {
  let component: HomeRentalScooterComponent;
  let fixture: ComponentFixture<HomeRentalScooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRentalScooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRentalScooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
