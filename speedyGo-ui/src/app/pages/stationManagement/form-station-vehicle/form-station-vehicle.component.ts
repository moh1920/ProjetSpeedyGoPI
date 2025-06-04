import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GoogleMapsModule} from "@angular/google-maps";
import {StationControllerService} from "../../../services/services/station-controller.service";
import {Station} from "../../../services/models/station";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-form-station-vehicle',
  imports: [GoogleMapsModule, ReactiveFormsModule, NgIf],
  templateUrl: './form-station-vehicle.component.html',
  styleUrl: './form-station-vehicle.component.scss',
  standalone:true,
})
export class FormStationVehicleComponent {
  stationForm!: FormGroup;
  successMessage: string = '';

  // Coordonnées initiales
  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // Tunis par défaut
  zoom = 12;
  markerPosition!: google.maps.LatLngLiteral;

  constructor(private fb: FormBuilder, private stationService: StationControllerService) {}

  ngOnInit(): void {
    this.stationForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      location: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      capacity: [null, [Validators.required, Validators.min(1)]],
      is_active: [true],
      createdAt: [''],
      updatedAt: ['']
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.stationForm.patchValue({
        latitude: this.markerPosition.lat,
        longitude: this.markerPosition.lng
      });

      this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
    }
  }

  getAddress(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        this.stationForm.patchValue({ location: results[0].formatted_address });
      } else {
        console.warn('Aucune adresse trouvée pour ces coordonnées.');
      }
    });
  }


  onSubmit(): void {
    if (this.stationForm.valid) {
      let stationData: Station = this.stationForm.value;

      if (stationData.createdAt) {
        stationData.createdAt = new Date(stationData.createdAt).toISOString();
      }

      if (stationData.updatedAt) {
        stationData.updatedAt = new Date(stationData.updatedAt).toISOString();
      }

      this.stationService.addStation({ body: stationData }).subscribe({
        next: (response) => {
          console.log('Station ajoutée avec succès:', response);
          this.successMessage = 'Station ajoutée avec succès !';
          this.stationForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout:', error);
        }
      });
    }
  }
}
