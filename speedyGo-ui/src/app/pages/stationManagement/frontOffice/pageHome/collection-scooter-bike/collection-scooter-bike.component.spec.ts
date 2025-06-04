import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionScooterBikeComponent } from './collection-scooter-bike.component';

describe('CollectionScooterBikeComponent', () => {
  let component: CollectionScooterBikeComponent;
  let fixture: ComponentFixture<CollectionScooterBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionScooterBikeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionScooterBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
