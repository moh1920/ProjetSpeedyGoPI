import { Component, OnInit } from '@angular/core';
import { LoyaltyProgramService } from "../loyalty-program/services/loyalty-program.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoyaltyProgramDTO } from "../loyalty-program/model/LoyaltyProgram";
import { DatePipe, NgClass, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-loyal-program-details',
  imports: [
    NgIf,
    NgClass,
    DatePipe,
    NgForOf
  ],
  templateUrl: './loyal-program-details.component.html',
  standalone: true,
  styleUrl: './loyal-program-details.component.scss'
})
export class LoyalProgramDetailsComponent implements OnInit {
  loyaltyProgram: LoyaltyProgramDTO | null = null;
  loading: boolean = true;
  error: string | null = null;
  currentDate: Date = new Date();

  constructor(
    private loyaltyProgramService: LoyaltyProgramService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.getProgramDetails(id);
      } else {
        this.error = "Invalid program ID";
        this.loading = false;
      }
    });
  }

  getProgramDetails(id: number) {
    this.loading = true;
    this.error = null;

    this.loyaltyProgramService.getLoyaltyProgramById(id).subscribe({
      next: (data) => {
        this.loyaltyProgram = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching program details:', err);
        this.error = "Failed to load loyalty program details. Please try again later.";
        this.loading = false;
      }
    });
  }

  onBack() {
    this.router.navigate(['/loyaltyPrograms']);
  }

  onEdit() {
    if (this.loyaltyProgram?.id) {
      this.router.navigate(['/loyaltyProgram/edit', this.loyaltyProgram.id]);
    }
  }

  isProgramActive(): boolean {
    if (!this.loyaltyProgram) return false;

    const isActive = this.loyaltyProgram.isActive ?? false;
    const startDate = this.loyaltyProgram.startDate ? new Date(this.loyaltyProgram.startDate) : null;
    const endDate = this.loyaltyProgram.endDate ? new Date(this.loyaltyProgram.endDate) : null;

    const hasStarted = startDate ? startDate <= this.currentDate : true;
    const hasNotEnded = endDate ? endDate >= this.currentDate : true;

    return isActive && hasStarted && hasNotEnded;
  }

  getStatusLabel(): string {
    if (!this.loyaltyProgram?.isActive) return 'Inactive';

    const startDate = this.loyaltyProgram.startDate ? new Date(this.loyaltyProgram.startDate) : null;
    const endDate = this.loyaltyProgram.endDate ? new Date(this.loyaltyProgram.endDate) : null;

    if (startDate && startDate > this.currentDate) {
      return 'Upcoming';
    } else if (endDate && endDate < this.currentDate) {
      return 'Expired';
    } else {
      return 'Active';
    }
  }

  getStatusClass(): string {
    const status = this.getStatusLabel();
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Upcoming': return 'bg-info';
      case 'Expired': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }
}
