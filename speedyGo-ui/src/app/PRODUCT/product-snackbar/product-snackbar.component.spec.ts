import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSnackbarComponent } from './product-snackbar.component';

describe('ProductSnackbarComponent', () => {
  let component: ProductSnackbarComponent;
  let fixture: ComponentFixture<ProductSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
