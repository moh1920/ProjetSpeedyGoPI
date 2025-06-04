import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaisScooterOrBikeComponent } from './detais-scooter-or-bike.component';

describe('DetaisScooterOrBikeComponent', () => {
  let component: DetaisScooterOrBikeComponent;
  let fixture: ComponentFixture<DetaisScooterOrBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetaisScooterOrBikeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetaisScooterOrBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
