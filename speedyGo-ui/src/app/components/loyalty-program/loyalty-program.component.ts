import { Component, inject, OnInit } from '@angular/core';
import { LoyaltyProgramService } from "./services/loyalty-program.service";
import { LoyaltyProgramDTO } from "./model/LoyaltyProgram";
import { DatePipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: 'app-loyalty-program',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgClass
  ],
  templateUrl: './loyalty-program.component.html',
  standalone: true,
  styleUrls: ['./loyalty-program.component.scss']
})
export class LoyaltyProgramComponent implements OnInit {
  loyaltyPrograms: LoyaltyProgramDTO[] = [];
  filteredPrograms: LoyaltyProgramDTO[] = [];
  searchQuery: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  itemsPerPage = 5; // Showing more items per page
  selectedProgram: LoyaltyProgramDTO | null = null;

  constructor(
    private loyaltyProgramService: LoyaltyProgramService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadLoyaltyPrograms();
  }

  loadLoyaltyPrograms() {
    this.loyaltyProgramService.getAllLoyaltyPrograms().subscribe({
      next: (data) => {
        this.loyaltyPrograms = data;
        this.filteredPrograms = data;
        console.log('Loaded loyalty programs:', this.loyaltyPrograms);
      },
      error: (err) => {
        console.error('Error loading loyalty programs:', err);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredPrograms = this.loyaltyPrograms;
    } else {
      this.filteredPrograms = this.loyaltyPrograms.filter(program =>
        program.programName?.toLowerCase().includes(query) ||
        program.promoCode?.toLowerCase().includes(query) ||
        program.description?.toLowerCase().includes(query)
      );
    }
    this.currentPage = 1; // Reset to first page on filter
  }

  sortByName() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredPrograms.sort((a, b) => {
      const nameA = a.programName ? a.programName.toLowerCase() : '';
      const nameB = b.programName ? b.programName.toLowerCase() : '';
      return this.sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  get paginatedPrograms() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPrograms.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPrograms.length / this.itemsPerPage);
  }

  viewDetails(id: number) {
    this.router.navigate(['/loyaltyProgram/details', id]);
  }

  openConfirmModal(program: LoyaltyProgramDTO, modal: any) {
    this.selectedProgram = program;
    this.modalService.open(modal, { centered: true });
  }

  confirmDelete() {
    if (this.selectedProgram) {
      this.deleteProgram(this.selectedProgram.id);
      this.modalService.dismissAll();
    }
  }

  private deleteProgram(id: number) {
    this.loyaltyProgramService.deleteLoyaltyProgram(id).subscribe({
      next: () => {
        this.loadLoyaltyPrograms();
      },
      error: (err) => {
        console.error('Error deleting loyalty program:', err);
      }
    });
  }
}
