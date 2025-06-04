import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequestedCarpoolComponent } from './list-requested-carpool.component';

describe('ListRequestedCarpoolComponent', () => {
  let component: ListRequestedCarpoolComponent;
  let fixture: ComponentFixture<ListRequestedCarpoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRequestedCarpoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRequestedCarpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
