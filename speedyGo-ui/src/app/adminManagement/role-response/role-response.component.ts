import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RoleRequestService } from "../role-request.service";
import {UserService} from "../../services/services/user.service";


@Component({
  selector: 'app-role-response',
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    DatePipe
  ],
  templateUrl: './role-response.component.html',
  standalone: true,
  styleUrl: './role-response.component.scss'
})
export class RoleResponseComponent implements OnInit {
  requests: any[] = []; // Replace with proper interface type
  filteredRequests: any[] = [];
  loading: boolean = true;
  error: string = '';
  message: string = '';
  searchTerm: string = ''; // Added searchTerm property

  constructor(private roleRequestService: RoleRequestService,private userService:UserService) {}




  fetchRequests(): void {
    this.loading = true;
    this.error = '';
    this.roleRequestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        console.log(data);

        this.filteredRequests = [...data]; // Initialize filtered list
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading requests', err);
        this.error = 'Failed to load role requests. Please try again.';
        this.loading = false;
      }
    });
  }

  // Filter requests when search term changes
  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRequests = [...this.requests];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredRequests = this.requests.filter(request =>
      request.firstName.toLowerCase().includes(term) ||
      request.lastName.toLowerCase().includes(term) ||
      request.email.toLowerCase().includes(term)
    );
  }

  approve(userId: string, role: 'DRIVER' | 'PARTNER'): void {
    this.loading = true;
    this.roleRequestService.approveRole(userId, role).subscribe({
      next: (res) => {
        this.message = `Request approved as ${role}`;
        this.fetchRequests(); // Refresh after approval
      },
      error: (err) => {
        console.error('Error approving request', err);
        this.error = 'Failed to approve request.';
        this.loading = false;
      }
    });
  }

  rejectRequest(userId: string): void {
    this.loading = true;
    this.roleRequestService.rejectRequest(userId).subscribe({
      next: (response) => {
        this.message = 'Request rejected successfully';
        this.fetchRequests(); // Reload the requests after rejection
      },
      error: (error) => {
        console.error('Error rejecting request', error);
        this.error = 'Failed to reject request.';
        this.loading = false;
      }
    });
  }

  // Helper method to get initials from name
  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  // Clear any alert messages
  clearMessages(): void {
    this.message = '';
    this.error = '';
  }

  ngOnInit(): void {
    this.fetchRequests();
  }
}
