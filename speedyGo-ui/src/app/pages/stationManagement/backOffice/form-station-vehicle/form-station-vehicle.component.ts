import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GoogleMapsModule} from "@angular/google-maps";
import {StationControllerService} from "../../../../services/services/station-controller.service";
import {Station} from "../../../../services/models/station";
import {NgIf} from "@angular/common";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AppTopstripComponent} from "../../../../layouts/full/top-strip/topstrip.component";
import {Dir} from "@angular/cdk/bidi";
import {HeaderComponent} from "../../../../layouts/full/header/header.component";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {NgScrollbarModule} from "ngx-scrollbar";
import {SidebarComponent} from "../../../../layouts/full/sidebar/sidebar.component";
import {Router, RouterLink} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-station-vehicle',
  imports: [GoogleMapsModule, ReactiveFormsModule, NgIf, AppTopstripComponent, Dir, HeaderComponent, MatIcon, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, NgScrollbarModule, SidebarComponent, RouterLink],
  templateUrl: './form-station-vehicle.component.html',
  styleUrl: './form-station-vehicle.component.scss',
  standalone:true,
})
export class FormStationVehicleComponent {
  stationForm!: FormGroup;
  successMessage: string = '';

  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`

  // Coordonnées initiales
  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // Tunis par défaut
  zoom = 12;
  markerPosition!: google.maps.LatLngLiteral;
  submitted: false;

  constructor(private fb: FormBuilder, private stationService: StationControllerService
  ,private router: Router) {}

  ngOnInit(): void {
    this.stationForm = this.fb.group({
      id: [null],
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
      latitude: ['', [
        Validators.required,
        Validators.min(-90),
        Validators.max(90)
      ]],
      longitude: ['', [
        Validators.required,
        Validators.min(-180),
        Validators.max(180)
      ]],      capacity: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000),
        Validators.pattern(/^[0-9]+$/)
      ]],
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
          Swal.fire({
            title: 'Add with success',
            text: `The Station  Added With Success.`,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#198754' // vert Bootstrap
          });
          this.stationForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout:', error);
          Swal.fire({
            icon: 'error',
            title: 'Failed to Add Station',
            text: error?.error || 'An error occurred while adding the station.',
            confirmButtonColor: '#dc3545'
          });
        }
      });
    }
  }


  onCancel() {
    this.router.navigate(['/stationVehicleList']);

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

}
