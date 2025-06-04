
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';


import {CurrencyPipe, DatePipe, NgForOf, NgIf,CommonModule} from "@angular/common";
import {Dir} from "@angular/cdk/bidi";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NgScrollbarModule} from "ngx-scrollbar";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";

import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {BreakpointObserver} from "@angular/cdk/layout";
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import * as diagnostics_channel from "diagnostics_channel";
import {VehicleRentalControllerService} from "../../../../services/services/vehicle-rental-controller.service";
import {VehicleRental} from "../../../../services/models/vehicle-rental";
import {AppTopstripComponent} from "../../../../layouts/full/top-strip/topstrip.component";
import {HeaderComponent} from "../../../../layouts/full/header/header.component";
import {SidebarComponent} from "../../../../layouts/full/sidebar/sidebar.component";
import {MatDialog} from "@angular/material/dialog";
import {QrCodeModalComponent} from "../qr-code-modal/qr-code-modal.component";
import {CustomVehicleRentalService} from "../../services/custom-vehicle-rental.service";
import {
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import { StationControllerService } from 'src/app/services/services';
import { Station } from 'src/app/services/models';
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {SearchVehiclePipe} from "../../pipe/pipes/search-vehicle.pipe";
import {PaginatedVehicleRentalResponse} from "../../../../services/models/PaginatedVehicleRentalResponse";
import {StrictHttpResponse} from "../../../../services/strict-http-response";
import {Paginator} from "primeng/paginator";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-list-vahicle-rantal',
  templateUrl: './list-vahicle-rantal.component.html',
  styleUrls: ['./list-vahicle-rantal.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    AppTopstripComponent,
    Dir,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NgScrollbarModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    RouterLink,
    FormsModule,
    MatIcon,
    MatListItem,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatCard,
    MatCardContent,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatIconButton,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    CurrencyPipe,
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    CommonModule,
    GoogleMap,
    MapMarker,
    SearchVehiclePipe,
    Paginator,
    TableModule
  ]
})
export class ListVahicleRantalComponent implements OnInit {
  displayedColumns: string[] = ['id', 'typeVehicleRental', 'status', 'batteryLevel', 'lastMaintenanceDate', 'actions'];
  vehicleRentals: VehicleRental[] = [];  // Initialisation à un tableau vide
  page: number = 0;
  size: number = 10;
  sortBy: string = 'createdAt';  // Tri par date de création
  sortOrder: string = 'desc';    // Tri par ordre décroissant
  totalPages: number = 0;
  successMessage : string = '';
  selectedRental : VehicleRental ;  // Le véhicule sélectionné pour mise à jour
  stationAll!: Station[];
  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // Position centrale (Tunis)
  zoom = 12;
  searchText: string = '';


  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`



  @ViewChild('stationModale') stationModale!: TemplateRef<any>;
  selectedStationId: null;
  totalElements: number = 0;


  constructor(private vehicleRentalService: VehicleRentalControllerService,
              private router : ActivatedRoute,
              private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              public serviceLocalCodeQr : CustomVehicleRentalService,
              private serviceStation : StationControllerService) {}
  ngOnInit(): void {
    this.fetchVehicleRentals();

    // Détecter si l'écran est mobile et ajuster la sidebar
    this.breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isOver = result.matches;
    });

  }

  onPageChange(event: any): void {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.sortBy = event.sortField || 'id';
    this.sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    this.fetchVehicleRentals();
  }


  loading: boolean = false;


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






  deleteRental(vehicleId : any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      console.log('Suppression du véhicule avec l\'ID :', vehicleId);

      this.vehicleRentalService.deleteVehicleRental({id : vehicleId}).subscribe({
        next: (response) => {
          console.log('Véhicule supprimé avec succès');
          this.fetchVehicleRentals();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du véhicule', error);
        }
      });
    }
  }





  openQrCodeDialog(vehicleId: any): void {
    this.serviceLocalCodeQr.getVehiculeQrCode(vehicleId).subscribe({
      next: (qrCodeUrl) => {
        this.dialog.open(QrCodeModalComponent, {
          width: '400px',
          data: { qrCode: qrCodeUrl }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du QR Code', error);
      }
    });
  }
  fetchAllStation(){
    this.serviceStation.getAllStation().subscribe(data => {
      this.stationAll = data as Station[] ;
    })
  }

  openAssignStationModal(rental : VehicleRental) {
    if (!rental) {
      console.error("Erreur : maintenance non définie !");
      return;
    }

    this.selectedStationId = null ;
    this.selectedRental = rental ;
    this.fetchAllStation() ;

    this.dialog.open(this.stationModale, {
      width: '600px',
      data: { rental: this.selectedRental },
    });
  }

  closeModal() {
    this.dialog.closeAll();

  }

  assignVehicleToMaintenance() {



    if (!this.selectedStationId || !this.selectedRental.id) {
      console.error("Erreur : Aucune maintenance sélectionnée !");
      alert("Aucune maintenance sélectionnée.");
      return;
    }
    this.vehicleRentalService.affectVehicleToStation({ idStation: this.selectedStationId ,
      idVehicle: this.selectedRental.id}).subscribe({
      next: () => {
        alert("Station assigné avec succès !");
        this.fetchVehicleRentals();
        this.closeModal();
      },
      error: (error) => {
        console.error("Erreur lors de l'affectation:", error);
        alert("Une erreur est survenue.");
      }
    });

  }


  onMarkerClick(station: any): void {
    if (station){
      this.selectedStationId = station.id;
    }

    // Optionnel : recentrer la carte sur la station cliquée
    if (station.latitude && station.longitude) {
      this.center = {
        lat: station.latitude,
        lng: station.longitude
      };
    }
  }



  get filteredVehicles() {
    if (!this.searchText) {
      return this.vehicleRentals;
    }

    const lowerSearch = this.searchText.toLowerCase();
    return this.vehicleRentals.filter(vehicle =>
      vehicle.models?.toLowerCase().includes(lowerSearch) ||
      vehicle.typeVehicleRental.toLowerCase().includes(lowerSearch) ||
      vehicle.mileage.toLocaleString().toLowerCase().includes(lowerSearch) ||
      vehicle.status?.toLowerCase().includes(lowerSearch)
    );
  }




}
