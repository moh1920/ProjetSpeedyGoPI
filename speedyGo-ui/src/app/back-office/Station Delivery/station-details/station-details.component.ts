import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StationDeliveryControllerService } from '../../../services/services/station-delivery-controller.service';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-station-details',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss']
})
export class StationDetailsComponent implements OnInit {
  station: any = null;
  loading: boolean = true;
  error: string | null = null;

  // Map configuration
  center: google.maps.LatLngLiteral = {
    lat: 36.8065,
    lng: 10.1815
  };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral | null = null;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: false, // Disable scroll zoom for better UX
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationService: StationDeliveryControllerService
  ) {}

  ngOnInit(): void {
    console.log('StationDetailsComponent initialized');
    const stationId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Station ID from route:', stationId);
    this.loadStationDetails(stationId);
  }

  private loadStationDetails(id: number): void {
    this.loading = true;
    this.stationService.getStationById({ id }).subscribe({
      next: (station) => {
        this.station = station;
        if (station.latitude && station.longitude) {
          this.center = {
            lat: station.latitude,
            lng: station.longitude
          };
          this.markerPosition = this.center;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading station details';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  onEdit(): void {
    this.router.navigate(['/stations/edit', this.station.id]);
  }

  onBack(): void {
    this.router.navigate(['/stations']);
  }
}