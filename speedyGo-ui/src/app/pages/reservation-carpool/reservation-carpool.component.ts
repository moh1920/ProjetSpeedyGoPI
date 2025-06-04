import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ReservationCarpool } from 'src/app/services/models';
import { ReservationCarpoolControllerService } from 'src/app/services/services';

@Component({
  selector: 'app-reservation-carpool',
  imports: [
    FormsModule,
    
    CommonModule , NavbarComponent
  ],
  templateUrl: './reservation-carpool.component.html',
  styleUrl: './reservation-carpool.component.scss'
})
export class ReservationCarpoolComponent {
  request = {
    departLocation: '',
    arrivalLocation: '',
    requestedSeats: 0,
    requestedPrice: 0,
    bookingDate: ''
  };

  isFormVisible = false;

  constructor(private carpoolService: ReservationCarpoolControllerService) {}

  onSubmit() {
    const newRequest = { ...this.request };
    this.carpoolService.addReservationCarpool({ body: newRequest }).subscribe(
      (response: ReservationCarpool) => {
        console.log('New reservation added:', response);
        this.resetForm();
      },
      error => {
        console.error('Error adding reservation:', error);
      }
    );
  }

  resetForm() {
    this.request = {
      departLocation: '',
      arrivalLocation: '',
      requestedSeats: 0,
      requestedPrice: 0,
      bookingDate: ''
    };
    this.isFormVisible = false;
  }
}