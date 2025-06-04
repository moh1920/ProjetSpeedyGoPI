import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-qr-code-modal',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    NgIf,
    NgForOf,
    MatButton
  ],
  templateUrl: './qr-code-modal.component.html',
  styleUrl: './qr-code-modal.component.scss',
  standalone : true ,
})
export class QrCodeModalComponent {

  constructor(
    public dialogRef: MatDialogRef<QrCodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { qrCode: string }
  ) {}

  close(): void {
    if (this.data.qrCode) {
      URL.revokeObjectURL(this.data.qrCode); // 🔹 Libérer l'URL Blob après fermeture
    }
    this.dialogRef.close();
  }
  printQrCode(): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html lang="">
          <head>
            <title>Impression du QR Code</title>
            <style>
              body { text-align: center; font-family: Arial, sans-serif; }
              img { max-width: 300px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h2>QR Code du Véhicule</h2>
            <img src="${this.data.qrCode}" alt="QR Code du véhicule">
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      console.error('Erreur lors de l\'ouverture de la fenêtre d\'impression.');
    }
  }
}
