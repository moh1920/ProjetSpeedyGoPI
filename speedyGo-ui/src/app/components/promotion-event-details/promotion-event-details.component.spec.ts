import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionEventDetailsComponent } from './promotion-event-details.component';

describe('PromotionEventDetailsComponent', () => {
  let component: PromotionEventDetailsComponent;
  let fixture: ComponentFixture<PromotionEventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionEventDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
