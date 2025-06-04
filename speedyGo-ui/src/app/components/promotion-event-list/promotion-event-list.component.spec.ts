import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionEventListComponent } from './promotion-event-list.component';

describe('PromotionEventListComponent', () => {
  let component: PromotionEventListComponent;
  let fixture: ComponentFixture<PromotionEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionEventListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
