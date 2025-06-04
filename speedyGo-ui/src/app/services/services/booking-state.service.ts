import { Injectable } from '@angular/core';
import { ReservationTaxi } from '../models';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  private bookings = new BehaviorSubject<ReservationTaxi[]>([]);
  bookings$ = this.bookings.asObservable();

  private bookingUpdatedSource = new Subject<ReservationTaxi>();
  bookingUpdated$ = this.bookingUpdatedSource.asObservable();

  updateBookings(bookings: ReservationTaxi[]) {
    this.bookings.next(bookings);
  }

  notifyBookingUpdate(updatedBooking: ReservationTaxi) {
    this.bookingUpdatedSource.next(updatedBooking);
  }

  updateBookingInList(updatedBooking: ReservationTaxi) {
    const currentBookings = this.bookings.value;
    const index = currentBookings.findIndex(b => b.id === updatedBooking.id);
    
    if (index !== -1) {
      currentBookings[index] = updatedBooking;
      this.bookings.next([...currentBookings]);
    }
  }

  deleteBookingFromList(id: number) {
    const currentBookings = this.bookings.value;
    this.bookings.next(currentBookings.filter(booking => booking.id !== id));
  }

}
