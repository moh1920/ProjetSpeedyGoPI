import { Component } from '@angular/core';
import {Html5QrcodeScanner} from "html5-qrcode";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-qr-code-scanner.component.ts',
  imports: [
    MatButton
  ],
  templateUrl: './qr-code-scanner.component.ts.component.html',
  styleUrl: './qr-code-scanner.component.ts.component.scss',
  standalone :true ,
})
export class QrCodeScannerComponentTsComponent {
  private html5QrcodeScanner: Html5QrcodeScanner | undefined;

  constructor() {}

  ngOnInit(): void {}

  // This function is triggered when the button is clicked to start scanning
  startScanning(): void {
    const config = {
      fps: 10, // frame per second
      qrbox: 250, // size of the scanning box
    };

    // Create an instance of the scanner
    this.html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader', // DOM element id to attach the scanner to
      config,
      false
    );

    // Start scanning
    this.html5QrcodeScanner.render(this.onScanSuccess, this.onScanError);
  }

  // Success callback for scanning
  onScanSuccess(decodedText: string, decodedResult: any) {
    console.log('Decoded text: ', decodedText);
    alert('QR Code scanned successfully: ' + decodedText);
    this.stopScanning(); // Stop scanning after successful QR code
  }

  // Error callback
  onScanError(errorMessage: string) {
    console.warn('QR Code scan error: ', errorMessage);
  }

  // Stop scanning when you want to stop the camera
  stopScanning() {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear(); // Stop the scanner
    }
  }
}
