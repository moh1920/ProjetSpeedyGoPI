import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurTrackerComponent } from './livreur-tracker.component';

describe('LivreurTrackerComponent', () => {
  let component: LivreurTrackerComponent;
  let fixture: ComponentFixture<LivreurTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreurTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreurTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
