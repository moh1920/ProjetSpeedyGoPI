import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScooterBikeComponent } from './list-scooter-bike.component';

describe('ListScooterBikeComponent', () => {
  let component: ListScooterBikeComponent;
  let fixture: ComponentFixture<ListScooterBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListScooterBikeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListScooterBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
