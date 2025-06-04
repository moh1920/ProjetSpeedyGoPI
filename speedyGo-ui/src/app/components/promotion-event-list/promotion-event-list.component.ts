import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {DeletePromotion$Params} from "../../services/fn/promotion-and-event/delete-promotion";
import {FormsModule} from "@angular/forms";
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbDropdownModule, NgbModal, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {PromotionAndEventService} from "../../services/services/promotion-and-event.service";
import {EventPromotion} from "../../services/models/event-promotion";


declare var bootstrap: any;

@Component({
  selector: 'app-promotion-event-list',
  imports: [
    FormsModule,
    NgClass,
    NgForOf,
    DatePipe,
    NgbDropdownModule,
    NgbTooltipModule,
    DecimalPipe,
    NgIf
  ],
  templateUrl: './promotion-event-list.component.html',
  standalone: true,
  styleUrl: './promotion-event-list.component.scss'
})
export class PromotionEventListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'typeEV_ep', 'description', 'discount', 'startDate', 'endDate', 'status'];
  promotionEvent: EventPromotion[] = [];
  filteredPV: EventPromotion[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  error: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Add Math property for use in template
  Math = Math;

  private pvService = inject(PromotionAndEventService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.loadPV();
  }

  loadPV() {
    this.pvService.getAllPromotions().subscribe({
      next: data => {
        this.promotionEvent = data;
        this.filteredPV = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching stations:', err);
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredPV = this.promotionEvent;
    } else {
      this.filteredPV = this.promotionEvent.filter(pv =>
        pv.typeEV_ep?.toLowerCase().includes(query) ||
        pv.status?.toLowerCase().includes(query) ||
        pv.description?.toLowerCase().includes(query)
      );
    }
    console.log('Filtered Stations:', this.filteredPV);
  }

  // Add reset filter method
  resetFilter() {
    this.searchQuery = '';
    this.filteredPV = [...this.promotionEvent];
  }

  sortByName(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredPV.sort((a, b) => {
      const nameA = a.typeEV_ep ? a.typeEV_ep.toLowerCase() : '';
      const nameB = b.typeEV_ep ? b.typeEV_ep.toLowerCase() : '';
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  sortByCapacity(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredPV.sort((a, b) => {
      const capacityA = a.discount ?? 0;
      const capacityB = b.discount ?? 0;
      return this.sortDirection === 'asc' ? capacityA - capacityB : capacityB - capacityA;
    });
  }

  viewDetails(id: number | undefined): void {
    if (id) {
      console.log('Navigating to details:', id);
      this.router.navigate(['pv', 'details', id])
        .then(success => console.log('Navigation result:', success))
        .catch(error => console.error('Navigation error:', error));
    }
  }

  editStation(pv: EventPromotion): void {
    this.router.navigate(['/pv/edit', pv.id]);
  }

  deleteStation(pv: EventPromotion): void {
    const param: DeletePromotion$Params = {
      pvId: pv.id as number
    };
    this.pvService.deletePromotion(param).subscribe({
      next: () => {
        this.loadPV();
      },
      error: (error) => {
        console.error('Error deleting station:', error);
      }
    });
  }

  addPV(): void {
    console.log('Navigating to add station page');
    this.router.navigate(['pv', 'add'])
      .then(success => console.log('Navigation result:', success))
      .catch(error => console.error('Navigation error:', error));
  }

  getShortDescription(description: string | undefined, wordLimit: number = 3): string {
    if (!description) return '';
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  @ViewChild('deleteModal') deleteModal!: ElementRef;

  selectedPost: any;

  openConfirmModal(post: any) {
    this.selectedPost = post;
    this.modalService.open(this.deleteModal);
  }

  confirmDelete() {
    if (this.selectedPost) {
      this.deleteStation(this.selectedPost);
      this.modalService.dismissAll();
    }
  }

  currentPage = 1;
  itemsPerPage = 5; // Increased from 2 to show more items per page

  get paginatedPV() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPV.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPV.length / this.itemsPerPage);
  }

  // Add the missing methods that caused errors

  // Method to get status class based on status value
  getStatusClass(status?: string): string {
    if (!status) return 'bg-secondary';

    switch (status) {
      case 'ACTIVE':
        return 'bg-success-subtle text-success';
      case 'UPCOMING':
        return 'bg-primary-subtle text-primary';
      case 'EXPIRED':
        return 'bg-warning-subtle text-warning';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  // Method to get status icon based on status value
  getStatusIcon(status?: string): string {
    if (!status) return 'bi-question-circle';

    switch (status) {
      case 'ACTIVE':
        return 'bi-check-circle-fill me-1';
      case 'UPCOMING':
        return 'bi-calendar-event-fill me-1';
      case 'EXPIRED':
        return 'bi-x-circle-fill me-1';
      default:
        return 'bi-question-circle me-1';
    }
  }

  // Method to generate pagination range
  getPaginationRange(): number[] {
    const range: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  }
}
