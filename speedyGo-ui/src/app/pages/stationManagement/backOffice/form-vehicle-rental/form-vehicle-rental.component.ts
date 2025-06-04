import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleRentalControllerService } from '../../../../services/services/vehicle-rental-controller.service';
import { VehicleRental } from '../../../../services/models/vehicle-rental';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { MatOption } from '@angular/material/autocomplete';
import { MatError } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import Swal from "sweetalert2";

enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'Under Maintenance'
}

enum VehicleType {
  BIKE = 'BIKE',
  SCOOTER = 'SCOOTER'
}

@Component({
  selector: 'app-form-vehicle-rental',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatSelect,
    MatInput,
    MatIcon,
    MatFormField,
    MatCard,
    MatOption,
    MatError,
    NgIf
  ],
  templateUrl: './form-vehicle-rental.component.html',
  styleUrls: ['./form-vehicle-rental.component.scss'],
})
export class FormVehicleRentalComponent {
  vehicleRentalForm!: FormGroup;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private vehicleRentalService: VehicleRentalControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleRentalForm = this.fb.group({
      id: [null],
      batteryLevel: [null, [Validators.min(0), Validators.max(100)]],
      costOfVehicleByKm: [null, Validators.min(0)],
      mileage: [null, [Validators.min(0)]],
      qrCode: [''],
      status: ['', Validators.required],
      models: ['', Validators.required],
      typeVehicleRental: ['', Validators.required],
      lastMaintenanceDate: [''],
      createdAt: [''],
      updatedAt: [''],
    });
  }

  selectedFile!: File;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.vehicleRentalForm.valid) {
      const vehicleRentalData: VehicleRental = this.vehicleRentalForm.value;

      // Conversion des dates au format ISO
      if (vehicleRentalData.createdAt) {
        vehicleRentalData.createdAt = new Date(vehicleRentalData.createdAt).toISOString();
      }

      if (vehicleRentalData.updatedAt) {
        vehicleRentalData.updatedAt = new Date(vehicleRentalData.updatedAt).toISOString();
      }

      if (vehicleRentalData.lastMaintenanceDate) {
        vehicleRentalData.lastMaintenanceDate = new Date(vehicleRentalData.lastMaintenanceDate).toISOString();
      }

      this.vehicleRentalService.addVehicleRentalWithImage(vehicleRentalData ,this.selectedFile).subscribe({
        next: (response) => {
          console.log('Véhicule ajouté avec succès:', response);
          Swal.fire({
            title: 'Add with success 🚲',
            text: `The Vehicle Rental Added With Success.`,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#198754' // vert Bootstrap
          });
          this.vehicleRentalForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout:', error);
          Swal.fire({
            icon: 'error',
            title: 'Failed to Add Vehicle',
            text: error?.error || 'An error occurred while adding the vehicle.',
            confirmButtonColor: '#dc3545'
          });
        },
      });
    }
  }

  onCancel() {
    this.router.navigate(['/VehicleRentalList']);
  }
}
