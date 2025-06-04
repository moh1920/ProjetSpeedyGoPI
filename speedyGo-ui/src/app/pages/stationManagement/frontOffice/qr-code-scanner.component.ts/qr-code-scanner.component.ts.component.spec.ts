import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeScannerComponentTsComponent } from './qr-code-scanner.component.ts.component';

describe('QrCodeScannerComponentTsComponent', () => {
  let component: QrCodeScannerComponentTsComponent;
  let fixture: ComponentFixture<QrCodeScannerComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrCodeScannerComponentTsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrCodeScannerComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
