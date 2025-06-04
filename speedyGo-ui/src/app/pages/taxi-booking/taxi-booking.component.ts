import { Component } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationTaxi } from 'src/app/services/models';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {ReservationTaxiControllerService} from "../../services/services/reservation-taxi-controller.service";

@Component({
  selector: 'app-taxi-booking',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule, MatIconModule, MatCardModule],
  templateUrl: './taxi-booking.component.html',
  standalone: true,
  styleUrl: './taxi-booking.component.scss'
})
export class TaxiBookingComponent {
  bookingForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  showPriceQuote = false;
  calculatedPrice: number | null = null;

  currentDateTime = new Date('2025-03-03 13:05:53');


  taxiTypes = ['STANDARD', 'PREMIUM'];
  minDateTime: string;
  tempReservation: ReservationTaxi | null = null;
  calculatedReservation: ReservationTaxi | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private taxiBookingService: ReservationTaxiControllerService,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
    this.minDateTime = now.toISOString().slice(0, 16);

    this.bookingForm = this.formBuilder.group({
      departure: ['', [Validators.required, Validators.minLength(3)]],
      arrival: ['', [Validators.required, Validators.minLength(3)]],
      dateTime: [this.minDateTime, Validators.required],
      typeTaxiReservation: ['STANDARD', Validators.required]
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 60000);
  }

  get f() { return this.bookingForm.controls; }

  private formatAddress(address: string): string {
    return address.trim().replace(/\s+/g, '+') + '+Tunisia';
  }

  formatUTCDateTime(date: Date): string {
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';
    this.showPriceQuote = false;

    if (this.bookingForm.invalid) {
      return;
    }

    const formattedDeparture = this.formatAddress(this.f['departure'].value);
    const formattedArrival = this.formatAddress(this.f['arrival'].value);

    // Create temporary reservation object with PENDING status
    this.tempReservation = {
      departure: this.f['departure'].value,
      arrival: this.f['arrival'].value,
      dateTime: this.f['dateTime'].value,
      typeTaxiReservation: this.f['typeTaxiReservation'].value,
      statusReservationTaxi: 'PENDING' as const
    };

    this.loading = true;

    const calculationRequest = {
      ...this.tempReservation,
      departure: formattedDeparture,
      arrival: formattedArrival
    };

    this.taxiBookingService.createReservation({body: calculationRequest})
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response && response.price !== undefined) {
            this.calculatedPrice = response.price;
            this.calculatedReservation = response;
            this.showPriceQuote = true;
            this.snackBar.open('Price calculated successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.error = 'Invalid response from server';
            this.snackBar.open('Error calculating price', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error calculating price: ' + (error.message || 'Unknown error');
          this.snackBar.open('Error calculating price', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  confirmBooking(): void {
    if (!this.calculatedReservation || !this.calculatedPrice) {
      return;
    }

    this.loading = true;

    // Utiliser l'ID de la réservation calculée pour la mise à jour
    const reservationId = this.calculatedReservation.id;

    // Garder le statut PENDING pour la confirmation
    const finalReservation: ReservationTaxi = {
      ...this.calculatedReservation,
      statusReservationTaxi: 'PENDING' as const
    };

    // Utiliser updateReservation au lieu de createReservation
    this.taxiBookingService.updateReservation({
      id: reservationId!,
      body: finalReservation
    })
    .subscribe({
      next: (response: ReservationTaxi) => {
        this.loading = false;
        this.success = `Reservation confirmed successfully! Your booking ID is: ${response.id}. Price: ${response.price} TND`;
        this.snackBar.open('Reservation confirmed successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error confirming reservation: ' + (error.message || 'Unknown error');
        this.snackBar.open('Error confirming reservation', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cancelBooking(): void {
    if (!this.calculatedReservation || !this.calculatedPrice) {
      this.resetForm();
      return;
    }

    const reservationId = this.calculatedReservation.id;

    // Mettre à jour le statut en CANCELED
    const cancelledReservation: ReservationTaxi = {
      ...this.calculatedReservation,
      statusReservationTaxi: 'CANCLED' as const // Correction de CANCLED en CANCELED
    };

    this.loading = true;

    // Utiliser updateReservation au lieu de createReservation
    this.taxiBookingService.updateReservation({
      id: reservationId!,
      body: cancelledReservation
    })
    .subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response) {
          this.snackBar.open('Reservation cancelled successfully', 'Close', {
            duration: 3000,
            panelClass: ['info-snackbar']
          });
        }
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error cancelling reservation: ' + (error.message || 'Unknown error');
        this.snackBar.open('Error cancelling reservation', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private resetForm(): void {
    this.bookingForm.reset({
      typeTaxiReservation: 'STANDARD',
      dateTime: this.minDateTime
    });
    this.submitted = false;
    this.showPriceQuote = false;
    this.calculatedPrice = null;
    this.tempReservation = null;
    this.calculatedReservation = null;
  }
}
