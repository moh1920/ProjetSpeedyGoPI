import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVehucleRentalComponent } from './update-vehucle-rental.component';

describe('UpdateVehucleRentalComponent', () => {
  let component: UpdateVehucleRentalComponent;
  let fixture: ComponentFixture<UpdateVehucleRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVehucleRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVehucleRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
