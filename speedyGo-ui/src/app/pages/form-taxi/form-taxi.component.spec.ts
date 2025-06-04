import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTaxiComponent } from './form-taxi.component';

describe('FormTaxiComponent', () => {
  let component: FormTaxiComponent;
  let fixture: ComponentFixture<FormTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
