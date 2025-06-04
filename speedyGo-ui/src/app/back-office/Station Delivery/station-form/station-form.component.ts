import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StationDeliveryControllerService } from '../../../services/services/station-delivery-controller.service';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss']
})
export class StationFormComponent implements OnInit {
  stationForm: FormGroup;
  stationId: number | null = null;
  submitted = false;

  // Map configuration
  center: google.maps.LatLngLiteral = {
    lat: 36.8065,
    lng: 10.1815
  };
  zoom = 10;
  markerPosition?: google.maps.LatLngLiteral;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private stationService: StationDeliveryControllerService
  ) {
    this.stationForm = this.initForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.stationId = +id;
      this.loadStationData(this.stationId);
    }
  }

  private initForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s-]+$/)
      ]],
      location: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      capacity: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000),
        Validators.pattern(/^[0-9]+$/)
      ]],
      contactPerson: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      contactNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{8}$/)
      ]],
      workingHours: ['', [
        Validators.required,
        Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      ]],
      latitude: ['', [
        Validators.required,
        Validators.min(-90),
        Validators.max(90)
      ]],
      longitude: ['', [
        Validators.required,
        Validators.min(-180),
        Validators.max(180)
      ]],
      isActive: [true]
    });
  }

  shouldShowError(controlName: string): boolean {
    const control = this.stationForm.get(controlName);
    return control ? (control.invalid && (control.touched || this.submitted)) : false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.stationForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) 
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['maxlength']) 
        return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
      if (control.errors['pattern']) {
        switch(controlName) {
          case 'name':
            return 'Only letters, numbers, spaces, and hyphens are allowed';
          case 'contactPerson':
            return 'Only letters and spaces are allowed';
          case 'contactNumber':
            return 'Must be exactly 8 digits';
          case 'workingHours':
            return 'Format must be HH:MM - HH:MM';
          default:
            return 'Invalid format';
        }
      }
      if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
      if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;
    }
    return '';
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.markerPosition = { lat, lng };
      this.stationForm.patchValue({
        latitude: lat,
        longitude: lng
      });
    }
  }

  loadStationData(id: number): void {
    this.stationService.getStationById({ id }).subscribe({
      next: (station) => {
        this.stationForm.patchValue(station);
        if (station.latitude && station.longitude) {
          this.center = {
            lat: station.latitude,
            lng: station.longitude
          };
          this.markerPosition = this.center;
        }
      },
      error: (error) => {
        console.error('Error loading station:', error);
      }
    });
  }

  onSave(): void {
    this.submitted = true;
    if (this.stationForm.valid) {
      const stationData = this.stationForm.value;
      if (this.stationId) {
        // Update existing station
        this.stationService.updateStation({ id: this.stationId, body: stationData }).subscribe({
          next: () => this.router.navigate(['/stations']),
          error: (error) => console.error('Error updating station:', error)
        });
      } else {
        // Create new station
        this.stationService.createStation({ body: stationData }).subscribe({
          next: () => this.router.navigate(['/stations']),
          error: (error) => console.error('Error creating station:', error)
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/stations']);
  }
}
