import { Component, OnInit } from '@angular/core';
import { SubscriptionControllerService } from '../../services/services/subscription-controller.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

interface SubscriptionDto {
  id?: number;
  planName?: string;
  price?: number;
  durationInDays?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  subscriberEmail?: string;
}

@Component({
  selector: 'app-subscription-management',
  imports: [FormsModule, CommonModule,   NgbDropdownModule,
    NgbTooltipModule],
  templateUrl: './subscription-managment.component.html',
  standalone: true,
  styleUrls: ['./subscription-managment.component.scss']
})
export class SubscriptionManagementComponent implements OnInit {
  subscriptionsList: SubscriptionDto[] = [];

  newSubscription: Partial<SubscriptionDto> = {
    planName: '',
    price: undefined,
    durationInDays: undefined,
    startDate: '',
    endDate: '',
    isActive: false,
    subscriberEmail: ''
  };

  selectedSubscription: SubscriptionDto | null = null;

  constructor(private subscriptionService: SubscriptionControllerService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllSubscriptions();
  }

  loadAllSubscriptions(): void {
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (subs: SubscriptionDto[]) => {
        this.subscriptionsList = subs;
        console.log('All Subscriptions:', subs);
      },
      error: (err: any) => {
        console.error('Error fetching subscriptions:', err);
      }
    });
  }

  add(): void {
    this.router.navigate(['subscripion-managments/add']);
  }

  onEditSubscription(subId: number): void {
    if (subId) {
      this.router.navigate(['subscripion-managments/edit/', subId]);
    }
  }

  deleteSubscription(subId: number): void {
    if (!subId) { return; }
    this.subscriptionService.deleteSubscription({ id: subId }).subscribe({
      next: () => {
        console.log('Subscription deleted:', subId);
        this.loadAllSubscriptions();
      },
      error: (err) => console.error('Error deleting subscription:', err)
    });
  }

  addSubscription(): void {
    this.router.navigate(['/subscription-managements/add']);
  }
}
