import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedyGoPlusComponent } from './speedy-go-plus.component';

describe('SpeedyGoPlusComponent', () => {
  let component: SpeedyGoPlusComponent;
  let fixture: ComponentFixture<SpeedyGoPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedyGoPlusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedyGoPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
