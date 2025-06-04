import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionformRentalComponent } from './sectionform-rental.component';

describe('SectionformRentalComponent', () => {
  let component: SectionformRentalComponent;
  let fixture: ComponentFixture<SectionformRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionformRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionformRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
