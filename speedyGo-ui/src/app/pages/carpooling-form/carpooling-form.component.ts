import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, NgModel, ReactiveFormsModule} from "@angular/forms";
import {  Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Carpooling } from 'src/app/services/models';
import {CarpoolingControllerService} from "../../services/services/carpooling-controller.service";

@Component({
  selector: 'app-carpooling-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent,

    RouterModule
],
  templateUrl: './carpooling-form.component.html',
  standalone: true,
  styleUrl: './carpooling-form.component.scss'
})
export class CarpoolingFormComponent {
  carpoolingForm: FormGroup;
  showForm = false; // Hide form by default


  constructor(private fb: FormBuilder, private carpoolingService: CarpoolingControllerService) {
    this.carpoolingForm = this.fb.group({
      departLocation: ['', Validators.required],
      arrivalLocation: ['', Validators.required],
      time: ['', Validators.required],
      seatsAvailable: [1, [Validators.required, Validators.min(1)]],
      pricePerSeat: [0, [Validators.required, Validators.min(0)]],
    });
  }


  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    if (this.carpoolingForm.valid) {
      const carpoolData: Carpooling = {
        ...this.carpoolingForm.value,
        status: 'open', // Default status when creating an offer
      };

      // Call the service to add the carpool offer
      this.carpoolingService.addCarpool({ body: carpoolData }).subscribe(
        (response: Carpooling) => {
          console.log('Carpool Offer Added:', response);
          this.toggleForm(); // Close the form after submission

          if (response.id !== undefined) { // Ensure id is defined
            // Now you can safely update the carpool
            this.carpoolingService.updateCarpool({
              id: response.id,  // Add the ID from the response
              body: response    // Pass the response as the body to update
            }).subscribe(
              (updatedOffer) => {
                console.log('Carpool Offer Updated:', updatedOffer);
              },
              (error) => {
                console.error('Error updating carpool offer:', error);
              }
            );
          } else {
            console.error('Error: Carpool ID is undefined.');
          }
        },
        (error) => {
          console.error('Error adding carpool offer:', error);
        }
      );
    }
  }
}
