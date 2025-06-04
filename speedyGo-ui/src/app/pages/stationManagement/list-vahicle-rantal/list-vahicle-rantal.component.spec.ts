import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVahicleRantalComponent } from './list-vahicle-rantal.component';

describe('ListVahicleRantalComponent', () => {
  let component: ListVahicleRantalComponent;
  let fixture: ComponentFixture<ListVahicleRantalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVahicleRantalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVahicleRantalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
