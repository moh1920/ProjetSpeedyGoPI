import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListItem, MatNavList } from '@angular/material/list';
import { NgScrollbarModule } from "ngx-scrollbar";
import { RouterModule } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from "@angular/common";
import { RentalControllerService } from "../../../../services/services/rental-controller.service";
import { Rental } from "../../../../services/models/rental";
import { SidebarComponent } from '../../../../layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../layouts/full/header/header.component';
import { AppTopstripComponent } from '../../../../layouts/full/top-strip/topstrip.component';
import {
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {RentalDTO} from "../../../../services/models/rental.dto";
import {SearchRentalPipe} from "../../pipe/pipes/search-rental.pipe";
import {FormsModule} from "@angular/forms";
import {ButtonDirective} from "primeng/button";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-rental-vehicle-list',
  templateUrl: './rental-vehicle-list.component.html',
  styleUrls: ['./rental-vehicle-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatNavList,
    MatListItem,
    NgScrollbarModule,
    RouterModule,
    NgForOf,
    NgIf,
    SidebarComponent,
    HeaderComponent,
    AppTopstripComponent,
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    SearchRentalPipe,
    FormsModule,
    ButtonDirective,
    TableModule
  ],
})
export class RentalVehicleListComponent implements OnInit {
  rentalList: RentalDTO[] = [];
  page: number = 0;
  size: number = 10;
  sortBy: string = 'id';
  sortOrder: string = 'desc';
  searchText: string ='';




  constructor(private serviceRental: RentalControllerService) {}

  ngOnInit() {
    this.fetchRentals();
  }




  totalElements: number = 0;
  loading: boolean = false;

  fetchRentals(): void {
    this.loading = true;
    this.serviceRental.getAllRentals({
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    }).subscribe(
      (response) => {
        this.rentalList = response.rentals;
        this.totalElements = response.totalItems;
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des locations', error);
        this.rentalList = [];
        this.totalElements = 0;
        this.loading = false;
      }
    );
  }



  onPageChange(event: any): void {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.sortBy = event.sortField || 'id';
    this.sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    this.fetchRentals();
  }

  editRental(id:any) {

  }

  deleteRentale(id:any) {

  }

  message: string = '';


  triggerJob() {
    this.serviceRental.runArchiveJob().subscribe({
      next: (res) => alert(this.message = res),
      error: (err) => this.message = 'Erreur lors du lancement du job !'
    });
  }


  get filterRental() {
    if (!this.searchText) {
      return this.rentalList;
    }

    const lowerSearch = this.searchText.toLowerCase();
    return this.rentalList.filter(rental =>
      rental.startingPointName.name?.toLowerCase().includes(lowerSearch) ||
      rental.destinationName.name?.toLowerCase().includes(lowerSearch) ||
      rental.distanceTraveled.toLocaleString().toLowerCase().includes(lowerSearch) ||
      rental.vehicleModel.toLowerCase().includes(lowerSearch) ||
      rental.customerEmail.toLowerCase().includes(lowerSearch) ||
      rental.customerName.toLowerCase().includes(lowerSearch)
    );
  }
}
