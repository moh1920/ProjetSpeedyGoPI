import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryRentalComponent } from './gallery-rental.component';

describe('GalleryRentalComponent', () => {
  let component: GalleryRentalComponent;
  let fixture: ComponentFixture<GalleryRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
