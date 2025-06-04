import { Component, OnInit, NgZone, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { StationDeliveryControllerService } from '../../services/services/station-delivery-controller.service';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Stationdelevery } from '../../services/models/stationdelevery';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-stations',
  templateUrl: './staion-delivery.component.html',
  styleUrls: ['./staion-delivery.component.scss'],
  imports: [NavbarComponent, CommonModule]
})
export class DeliveryStationsComponent implements OnInit, AfterViewInit {
  map: google.maps.Map;
  stations: Stationdelevery[] = [];
  selectedItem: Stationdelevery | null = null;

  constructor(
    private stationService: StationDeliveryControllerService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadStations();
  }

  ngOnInit(): void {}

  // Initialize the Google Map centered on Tunisia
  initMap(): void {
    const mapOptions = {
      center: new google.maps.LatLng(36.806495, 10.181531),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);
    } else {
      console.error('Map container not found!');
    }
  }

  // Load station data from the service
  loadStations(): void {
    this.stationService.getAllStations().subscribe((data) => {
      this.stations = data;
      this.addMarkers();
    });
  }

  // Add markers for each station and update selectedItem on marker click
  addMarkers(): void {
    this.stations.forEach(station => {
      if (station.latitude && station.longitude) {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(station.latitude, station.longitude),
          map: this.map,
          title: station.name || 'Station'
        });

        // Use NgZone to ensure Angular change detection runs on marker click
        marker.addListener('click', () => {
          this.ngZone.run(() => {
            this.selectedItem = station;
            this.cd.detectChanges();
          });
        });
      }
    });
  }

  // Cancel the station selection and reset layout to full-width map
  onCancelSelect(): void {
    this.ngZone.run(() => {
      this.selectedItem = null;
      this.cd.detectChanges();
    });
  }

  // Method to check if the station is open
  isOpen(workingHours: string): boolean {
    if (!workingHours) return false; // Return false if working hours are not defined

    const [start, end] = workingHours.split('-');
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startTime = startHour * 60 + startMinute; // Convert start time to minutes
    const endTime = endHour * 60 + endMinute; // Convert end time to minutes

    // Check if current time is within working hours
    return currentTime >= startTime && currentTime < endTime;
  }
}
