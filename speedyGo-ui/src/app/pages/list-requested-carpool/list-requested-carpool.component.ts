import { Component } from '@angular/core';
import { ReservationCarpoolComponent } from '../reservation-carpool/reservation-carpool.component';
import { ReservationCarpoolControllerService } from 'src/app/services/services';
import { ReservationCarpool } from 'src/app/services/models';
import { FormControl, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';



@Component({
  selector: 'app-list-requested-carpool',
  imports: [CommonModule , FormsModule , NavbarComponent],
  templateUrl: './list-requested-carpool.component.html',
  styleUrl: './list-requested-carpool.component.scss'
})
export class ListRequestedCarpoolComponent {
  carpoolRequests: ReservationCarpool[] = [];
  editingPrice: { id: number, newPrice: number} | null = null;
  searchCriteria: any = {
    price: null
  };

  constructor(private carpoolService: ReservationCarpoolControllerService) {}

  ngOnInit(): void {
    this.carpoolService.getAllReservationsCarpool().subscribe(
      (requests: ReservationCarpool[]) => {
        console.log('Fetched reservations:', requests);  // Log the fetched data
        this.carpoolRequests = requests;
      },
      error => {
        console.error('Error fetching reservations:', error);
      }
    );
  }
  


    onAccept(id: number) {
      this.carpoolService.acceptReservation({ id }).subscribe(
        (response: ReservationCarpool) => {
          console.log(`Reservation ${id} accepted`, response);
    
          // Manually update the status of the carpool request in the list
          const acceptedRequest = this.carpoolRequests.find(request => request.id === id);
          if (acceptedRequest) {
            acceptedRequest.status = 'accepted';  // Update the status of the reservation in the UI
            acceptedRequest.accepted = true;
          }
        },
        error => {
          console.error('Error accepting reservation:', error);
        }
      );
    }

  onModifyPrice(id: number, currentPrice: number) {
    // Set the request to be edited and set the current price as the default value
    this.editingPrice = { id, newPrice: currentPrice ?? 0 }; 
  }

  onSavePrice() {
    if (this.editingPrice) {
      const { id, newPrice } = this.editingPrice;
      // Update the price on the backend
      this.carpoolService.updateReservationCarpool({ id, body: { requestedPrice: newPrice } }).subscribe(
        (response: ReservationCarpool) => {
          console.log('Price updated successfully:', response);
          // Fetch the updated list of reservations
          this.carpoolService.getAllReservationsCarpool().subscribe(
            (requests: ReservationCarpool[]) => {
              this.carpoolRequests = requests;  // Update the list
            },
            error => {
              console.error('Error fetching updated reservations:', error);
            }
          );
          this.editingPrice = null;  // Clear the editing state
        },
        error => {
          console.error('Error saving price:', error);
        }
      );
    }
  }

  onCancelEdit() {
    this.editingPrice = null;  // Cancel the editing state
  }
// Load all requests
loadRequests() {
  this.carpoolService.getAllReservationsCarpool().subscribe(
    (requests: ReservationCarpool[]) => {
      this.carpoolRequests = requests;
      console.log('Loaded all reservations:', requests);
    },
    error => {
      console.error('Error loading reservations:', error);
    }
  );
}

  onSearchByPrice() {
    if (this.searchCriteria.price) {
      this.carpoolService.findByRequestedPrice({ requestedPrice: this.searchCriteria.price }).subscribe(
        (requests: ReservationCarpool[]) => {
          this.carpoolRequests = requests;
          console.log('Search results:', requests);
        },
        error => {
          console.error('Error fetching search results:', error);
        }
      );
    } else {
      // If no price is entered, you might want to fetch all requests
      this.loadRequests();
    }
  }
}