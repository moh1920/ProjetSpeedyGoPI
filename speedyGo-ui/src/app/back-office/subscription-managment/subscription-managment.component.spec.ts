import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionManagmentComponent } from './subscription-managment.component';

describe('SubscriptionManagmentComponent', () => {
  let component: SubscriptionManagmentComponent;
  let fixture: ComponentFixture<SubscriptionManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
