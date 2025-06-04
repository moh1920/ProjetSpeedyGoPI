import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionEventFormComponent } from './promotion-event-form.component';

describe('PromotionEventFormComponent', () => {
  let component: PromotionEventFormComponent;
  let fixture: ComponentFixture<PromotionEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionEventFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
