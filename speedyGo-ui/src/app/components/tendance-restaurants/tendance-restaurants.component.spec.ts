import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendanceRestaurantsComponent } from './tendance-restaurants.component';

describe('TendanceRestaurantsComponent', () => {
  let component: TendanceRestaurantsComponent;
  let fixture: ComponentFixture<TendanceRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TendanceRestaurantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TendanceRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
