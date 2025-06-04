  import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
  import { NavBarStationManagementComponent } from '../pageHome/nav-bar-station-management/nav-bar-station-management.component';
  import { FooterStationTemplateComponent } from '../pageHome/footer-station-template/footer-station-template.component';
  import {NgForOf, NgIf} from "@angular/common";
  import {HeaderComponent} from "../../../../layouts/full/header/header.component";
  import {NavbarComponent} from "../../../../components/navbar/navbar.component";
  import {VehicleRental} from "../../../../services/models/vehicle-rental";
  import {VehicleRentalControllerService} from "../../../../services/services/vehicle-rental-controller.service";
  import {ActivatedRoute, Router, RouterLink} from "@angular/router";
  import {BreakpointObserver} from "@angular/cdk/layout";
  import {MatDialog} from "@angular/material/dialog";
  import {CustomVehicleRentalService} from "../../services/custom-vehicle-rental.service";
  import {FooterComponent} from "../../../../components/footer/footer.component";
  import {FormsModule} from "@angular/forms";
  import {PaginatedVehicleRentalResponse} from "../../../../services/models/PaginatedVehicleRentalResponse";
  import {Paginator} from "primeng/paginator";
  import {CollectionScooterBikeComponent} from "../pageHome/collection-scooter-bike/collection-scooter-bike.component";
  import {CustomersFeedbackComponent} from "../pageHome/customers-feedback/customers-feedback.component";

  @Component({
    selector: 'app-list-scooter-bike',
    imports: [FooterStationTemplateComponent, NgForOf, HeaderComponent, NavbarComponent, RouterLink, FooterComponent, FormsModule, Paginator, CollectionScooterBikeComponent, CustomersFeedbackComponent, NgIf],
    templateUrl: './list-scooter-bike.component.html',
    styleUrl: './list-scooter-bike.component.scss',
    standalone : true ,
  })
  export class ListScooterBikeComponent implements OnInit{
    vehicleRentals: VehicleRental[] = [];  // Initialisation à un tableau vide
    page: number = 0;
    size: number = 10;
    sortBy: string = 'createdAt';  // Tri par date de création
    sortOrder: string = 'desc';    // Tri par ordre décroissant
    vehicleTypes = ['SCOOTER', 'BIKE', ]; // Types de véhicules à filtrer
    showRideBlock: boolean = false;



    filter = {
      type: '',
      status: '',
      minCost: null,
      maxCost : null,
    };
     loading: boolean;
     totalElements: number;
     currentPage: number;
     totalPages: number;
     first: number;

    filteredVehicles() {
      return this.vehicleRentals.filter(vehicle => {
        const matchesType = this.filter.type ? vehicle.typeVehicleRental === this.filter.type : true;
        const matchesStatus = this.filter.status ? vehicle.status === this.filter.status : true;
        const matchesMinCost = this.filter.minCost != null
          ? vehicle?.costOfVehicleByKm != null && vehicle.costOfVehicleByKm >= this.filter.minCost
          : true;
        const matchesMaxCost = this.filter.maxCost != null
          ? vehicle?.costOfVehicleByKm != null && vehicle.costOfVehicleByKm <= this.filter.maxCost
          : true;

        return matchesType && matchesStatus && matchesMaxCost && matchesMinCost;
      });
    }








    ngOnInit() {
      this.fetchVehicleRentals();
    }

    constructor(private vehicleRentalService: VehicleRentalControllerService,
                private router : ActivatedRoute,
                public dialog: MatDialog,
                public serviceLocalCodeQr : CustomVehicleRentalService,
                private routernav : Router) {}
    fetchVehicleRentals(): void {
      this.loading = true;
      this.vehicleRentalService.getAllVehicleRentalSimple({
        page: this.page,
        size: this.size,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      }).subscribe({
        next: (response: PaginatedVehicleRentalResponse) => {
          this.vehicleRentals = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des véhicules', error);
          this.vehicleRentals = [];
          this.totalElements = 0;
          this.loading = false;
        }
      });
    }


    onPageChange(event: any): void {
      this.first = event.first;  // La première ligne de la page actuelle
      this.size = event.rows;    // Le nombre de lignes par page
      this.fetchVehicleRentals();  // Recharge les données avec les nouveaux paramètres de pagination
    }


    @ViewChild('rideBlock') rideBlock!: ElementRef;

    toggleRideBlock() {
      this.showRideBlock = !this.showRideBlock;

      // Attendre que le DOM se mette à jour, puis scroller
      setTimeout(() => {
        if (this.rideBlock) {
          this.rideBlock.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }


    customerRental(){
      this.routernav.navigate(['/customerScooterBike'])
    }

  }
