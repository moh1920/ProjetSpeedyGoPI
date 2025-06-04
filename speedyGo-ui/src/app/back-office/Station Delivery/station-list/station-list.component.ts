import { StationDeliveryControllerService } from '../../../services/services/station-delivery-controller.service';
import { Stationdelevery } from '../../../services/models/stationdelevery';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    DecimalPipe
  ],
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'location', 'capacity', 'contactPerson', 'contactNumber', 'workingHours', 'latitude', 'longitude', 'isActive', 'actions'];
  stations: Stationdelevery[] = [];
  filteredStations: Stationdelevery[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  error: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  private stationService = inject(StationDeliveryControllerService);
  private router = inject(Router); // ✅ Inject Router

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.stationService.getAllStations().subscribe({
      next: data => {
        this.stations = data;
        this.filteredStations = data;
        console.log('All Stations:', this.stations);
      },
      error: err => {
        console.error('Error fetching stations:', err);
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.trim().toLowerCase();
    console.log('Search Query:', query);

    if (!query) {
      this.filteredStations = this.stations;
    } else {
      this.filteredStations = this.stations.filter(station =>
        station.name?.toLowerCase().includes(query) ||
        station.location?.toLowerCase().includes(query) ||
        station.contactPerson?.toLowerCase().includes(query) ||
        station.workingHours?.toLowerCase().includes(query)
      );
    }

    console.log('Filtered Stations:', this.filteredStations);
  }

  sortByName(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredStations.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : '';
      const nameB = b.name ? b.name.toLowerCase() : '';
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  sortByCapacity(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredStations.sort((a, b) => {
      const capacityA = a.capacity ?? 0;
      const capacityB = b.capacity ?? 0;
      return this.sortDirection === 'asc' ? capacityA - capacityB : capacityB - capacityA;
    });
  }

  viewDetails(id: number | undefined): void {
    if (id) {
      console.log('Navigating to details:', id);
      this.router.navigate(['stations', 'details', id])
        .then(success => console.log('Navigation result:', success))
        .catch(error => console.error('Navigation error:', error));
    }
  }

  editStation(id: number): void {
    this.router.navigate(['/stations/edit', id]);
  }

  deleteStation(id: number): void {
      this.stationService.deleteStation({ id }).subscribe({
        next: () => {
          this.loadStations();
        },
        error: (error) => {
          console.error('Error deleting station:', error);
        }
      });
    
  }

  addStation(): void {
    console.log('Navigating to add station page');
    this.router.navigate(['stations', 'add'])
      .then(success => console.log('Navigation result:', success))
      .catch(error => console.error('Navigation error:', error));
  }
}
