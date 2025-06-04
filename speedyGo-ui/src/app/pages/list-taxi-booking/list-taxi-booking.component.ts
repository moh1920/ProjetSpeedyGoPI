import { Component, OnInit } from '@angular/core';
import { ReservationTaxi } from 'src/app/services/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select'; // Ajout de MatSelectModule


import { MatCardModule } from '@angular/material/card';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { BookingStateService } from 'src/app/services/services/booking-state.service';
import {ReservationTaxiControllerService} from "../../services/services/reservation-taxi-controller.service";


@Component({
  selector: 'app-list-taxi-booking',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule, CommonModule, NavbarComponent,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonToggleModule, MatProgressSpinnerModule, MatCardModule, MatSelectModule, FormsModule
    , ReactiveFormsModule
  ],
  templateUrl: './list-taxi-booking.component.html',
  styleUrl: './list-taxi-booking.component.scss',
  standalone: true,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-20px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({opacity: 0, transform: 'translateY(-20px)'}))
      ])
    ])
  ]
})

export class ListTaxiBookingComponent implements OnInit {
  currentDateTime = new Date('2025-03-03 15:36:21');

  bookings: ReservationTaxi[] = [];
  editForm: FormGroup;
  currentBooking: ReservationTaxi | null = null;
  showEditForm = false;
  loading = false;
  taxiTypes = ['STANDARD', 'PREMIUM'];
  minDateTime: string;
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'id',
    'departure',
    'arrival',
    'price',
    'dateTime',
    'typeTaxiReservation',
    'statusReservationTaxi',
    'actions'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationTaxiControllerService,
    private bookingStateService: BookingStateService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initializeForm();
    this.setupSubscriptions();
  }

  private initializeForm(): void {
    const now = new Date();
    this.minDateTime = now.toISOString().slice(0, 16);

    this.editForm = this.formBuilder.group({
      departure: ['', [Validators.required, Validators.minLength(3)]],
      arrival: ['', [Validators.required, Validators.minLength(3)]],
      dateTime: [this.minDateTime, Validators.required],
      typeTaxiReservation: ['STANDARD', Validators.required]
    });
  }

  private setupSubscriptions(): void {
    this.subscriptions.push(
      this.bookingStateService.bookings$.subscribe(
        bookings => this.bookings = bookings
      ),
      this.bookingStateService.bookingUpdated$.subscribe(
        updatedBooking => this.handleBookingUpdate(updatedBooking)
      )
    );
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBookings(): void {
    this.loading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.bookingStateService.updateBookings(data);
        this.loading = false;
      },
      error: (error) => {
        this.showSnackBar('Error loading bookings', 'error');
        this.loading = false;
      }
    });
  }

  editBooking(booking: ReservationTaxi): void {
    this.currentBooking = booking;
    const dateTime = booking.dateTime ? new Date(booking.dateTime).toISOString().slice(0, 16) : this.minDateTime;

    this.editForm.patchValue({
      departure: booking.departure,
      arrival: booking.arrival,
      dateTime: dateTime,
      typeTaxiReservation: booking.typeTaxiReservation
    });
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.currentBooking = null;
    this.editForm.reset({
      typeTaxiReservation: 'STANDARD',
      dateTime: this.minDateTime
    });
  }

  updateBooking(): void {
    if (this.editForm.invalid || !this.currentBooking) {
      return;
    }

    this.loading = true;
    const updatedBooking: ReservationTaxi = {
      id: this.currentBooking.id,
      departure: this.editForm.value.departure,
      arrival: this.editForm.value.arrival,
      dateTime: this.editForm.value.dateTime,
      typeTaxiReservation: this.editForm.value.typeTaxiReservation,
      statusReservationTaxi: this.currentBooking.statusReservationTaxi,
      price: this.currentBooking.price
    };

    this.reservationService.updateReservation({
      id: this.currentBooking.id!,
      body: updatedBooking
    }).subscribe({
      next: (response) => {
        this.bookingStateService.updateBookingInList(updatedBooking);
        this.showSnackBar('Booking updated successfully', 'success');
        this.cancelEdit();
        this.loading = false;
      },
      error: (error) => {
        this.showSnackBar('Error updating booking', 'error');
        this.loading = false;
      }
    });
  }

  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.reservationService.deleteReservation({ id }).subscribe({
        next: () => {
          this.bookingStateService.deleteBookingFromList(id);
          this.showSnackBar('Booking deleted successfully', 'success');
        },
        error: () => {
          this.showSnackBar('Error deleting booking', 'error');
        }
      });
    }
  }

  navigateToBooking(): void {
    this.router.navigate(['/bookingTaxi']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED': return '#4CAF50';
      case 'PENDING': return '#FFA726';
      case 'CANCELLED': return '#EF5350';
      default: return '#757575';
    }
  }

  private handleBookingUpdate(updatedBooking: ReservationTaxi): void {
    const index = this.bookings.findIndex(b => b.id === updatedBooking.id);
    if (index !== -1) {
      this.bookings[index] = updatedBooking;
      this.bookings = [...this.bookings];
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`${type}-snackbar`]
    });
  }
}
