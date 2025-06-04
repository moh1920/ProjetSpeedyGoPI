import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarpoolOfferComponent } from './list-carpool-offer.component';

describe('ListCarpoolOfferComponent', () => {
  let component: ListCarpoolOfferComponent;
  let fixture: ComponentFixture<ListCarpoolOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCarpoolOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCarpoolOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
