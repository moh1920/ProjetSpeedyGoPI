import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Carpooling } from 'src/app/services/models';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import {CarpoolingControllerService} from "../../services/services/carpooling-controller.service";
import {BookingSeatsControllerService} from "../../services/services/booking-seats-controller.service";

@Component({
  selector: 'app-list-carpool-offer',
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './list-carpool-offer.component.html',
  standalone: true,
  styleUrl: './list-carpool-offer.component.scss'
})
export class ListCarpoolOfferComponent implements OnInit{
  carpoolOffers: Carpooling[] = [];
  favorites: any[] = [];
  showFavorites: boolean = false;
  isModalOpen: boolean = false;
  selectedOffer: any = null;
  availableSeats: boolean[] = [];  // Store the available seats (checkboxes)

  constructor(private carpoolingService: CarpoolingControllerService, private bookingSeatsService: BookingSeatsControllerService) {}

  ngOnInit(): void {
    this.loadCarpoolOffers();
  }

  loadCarpoolOffers() {
    this.carpoolingService.getAllCarpools().subscribe(
      (offers) => {
        this.carpoolOffers = offers;
      },
      (error) => {
        console.error('Error fetching carpool offers:', error);
      }
    );
  }

  bookSeats(offer: any) {
    console.log('Booking seats for:', offer);
    // Ajoute ici la logique pour la réservation (redirection, API call, etc.)
  }
  toggleFavorite(offer: any) {
    const index = this.favorites.findIndex(fav => fav.id === offer.id);

    if (index === -1) {
      this.favorites.push(offer);
      console.log('Added to favorites:', offer);
    } else {
      this.favorites.splice(index, 1);
      console.log('Removed from favorites:', offer);
    }

    this.saveFavorites();
  }

  // Check if the offer is in favorites
  isFavorite(offer: any): boolean {
    return this.favorites.some(fav => fav.id === offer.id);
  }

  // Save favorites to localStorage
  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  // Load favorites from localStorage
  loadFavorites() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  // Toggle view between all offers and favorites
  toggleFavoritesView() {
    this.showFavorites = !this.showFavorites;
  }
  //booking seats
  // Ouvrir la fenêtre modale
  openBookingModal(offer: any) {
    this.selectedOffer = offer;
    this.availableSeats = Array(offer.seatsAvailable).fill(false);  // Initialiser les cases à cocher pour les sièges disponibles
    this.isModalOpen = true;
    console.log('Modal ouvert pour l\'offre:', offer);  // Ajout d'un message de debug
  }

  // Fermer la fenêtre modale
  closeBookingModal() {
    this.isModalOpen = false;
    this.selectedOffer = null;
  }

  submitBooking() {
    const seatsRequested = this.availableSeats.filter(seat => seat).length;

    if (seatsRequested <= this.selectedOffer.seatsAvailable) {
      // Call the service to book the seats
      this.bookingSeatsService.createBooking({
        carpoolingId: this.selectedOffer.id,
        seatsRequested: seatsRequested
      }).subscribe(
        response => {
          console.log('Booking successful:', response);

          // Update the available seats locally
          this.selectedOffer.seatsAvailable -= seatsRequested;

          // If all seats are booked, close the offer
          if (this.selectedOffer.seatsAvailable === 0) {
            this.selectedOffer.status = "closed"; // Mark the offer as closed
          }

          // Update the offers list to reflect the change (in frontend)
          const index = this.carpoolOffers.findIndex(offer => offer.id === this.selectedOffer.id);
          if (index !== -1) {
            this.carpoolOffers[index] = { ...this.selectedOffer }; // Update the offer in the list
          }

          // Optionally, call the API to confirm the update (optional)
          this.carpoolingService.updateCarpool({
            id: this.selectedOffer.id,
            body: this.selectedOffer
          }).subscribe(
            updatedOffer => {
              console.log('Carpool offer updated:', updatedOffer);
            },
            error => {
              console.error('Error updating carpool offer:', error);
            }
          );

          // Close the modal after booking
          this.closeBookingModal();
        },
        error => {
          console.error('Error booking seats:', error);
        }
      );
    } else {
      alert('You cannot book more seats than available.');
    }
  }



  // Function to remove a closed offer from both the available offers and the favorites list
  removeClosedOffer(offer: any) {
    // Remove the offer from the available carpool offers list
    this.carpoolOffers = this.carpoolOffers.filter(o => o.id !== offer.id);

    // Remove the offer from the favorites list if it's there
    this.favorites = this.favorites.filter(fav => fav.id !== offer.id);
  }


  // Vérifier si des sièges ont été sélectionnés
  seatsSelected(): boolean {
    return this.availableSeats.some(seat => seat);  // Retourne true si au moins une case est cochée
  }
}
