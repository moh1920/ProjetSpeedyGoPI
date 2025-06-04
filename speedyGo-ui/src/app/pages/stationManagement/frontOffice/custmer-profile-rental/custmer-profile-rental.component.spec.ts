import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustmerProfileRentalComponent } from './custmer-profile-rental.component';

describe('CustmerProfileRentalComponent', () => {
  let component: CustmerProfileRentalComponent;
  let fixture: ComponentFixture<CustmerProfileRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustmerProfileRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustmerProfileRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
