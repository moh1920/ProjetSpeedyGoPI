import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatsComponentComponent } from './customer-stats-component.component';

describe('CustomerStatsComponentComponent', () => {
  let component: CustomerStatsComponentComponent;
  let fixture: ComponentFixture<CustomerStatsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerStatsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerStatsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
