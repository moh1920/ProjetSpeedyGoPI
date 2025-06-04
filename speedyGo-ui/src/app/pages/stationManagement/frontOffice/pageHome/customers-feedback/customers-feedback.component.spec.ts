import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersFeedbackComponent } from './customers-feedback.component';

describe('CustomersFeedbackComponent', () => {
  let component: CustomersFeedbackComponent;
  let fixture: ComponentFixture<CustomersFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
