import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRecommandationComponantComponent } from './trip-recommandation-componant.component';

describe('TripRecommandationComponantComponent', () => {
  let component: TripRecommandationComponantComponent;
  let fixture: ComponentFixture<TripRecommandationComponantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripRecommandationComponantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripRecommandationComponantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
