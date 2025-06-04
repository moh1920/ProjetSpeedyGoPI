import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiUpdateComponent } from './taxi-update.component';

describe('TaxiUpdateComponent', () => {
  let component: TaxiUpdateComponent;
  let fixture: ComponentFixture<TaxiUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
