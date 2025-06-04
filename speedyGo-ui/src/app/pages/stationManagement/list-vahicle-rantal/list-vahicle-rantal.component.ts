
import {Component, OnInit, ViewChild} from '@angular/core';
import { VehicleRental } from "../../../services/models/vehicle-rental";
import { VehicleRentalControllerService } from "../../../services/services/vehicle-rental-controller.service";
import { HttpResponse } from '@angular/common/http';  // Importer HttpResponse
import { getAllVehicleRental } from "../../../services/fn/vehicle-rental-controller/get-all-vehicle-rental";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {AppTopstripComponent} from "../../../layouts/full/top-strip/topstrip.component";
import {Dir} from "@angular/cdk/bidi";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NgScrollbarModule} from "ngx-scrollbar";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../../../layouts/full/sidebar/sidebar.component";
import {HeaderComponent} from "../../../layouts/full/header/header.component";
import {routes} from "../../../app.routes";
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
    MatButton
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
  selectedRental: VehicleRental | null = null;  // Le véhicule sélectionné pour mise à jour

  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`

  constructor(private vehicleRentalService: VehicleRentalControllerService,
              private router : ActivatedRoute,
              private breakpointObserver: BreakpointObserver) {}
  ngOnInit(): void {
    this.fetchVehicleRentals();

    // Détecter si l'écran est mobile et ajuster la sidebar
    this.breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isOver = result.matches;
    });
  }

  fetchVehicleRentals(): void {
    this.vehicleRentalService.getAllVehicleRental({
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    }).subscribe(
      // Typage explicite pour la réponse
      (response) => {  // Utiliser HttpResponse<any>
        console.log('Réponse complète de l\'API:', response);
        this.vehicleRentals = response as VehicleRental[] ;
      },
      // Gestion des erreurs
      (error) => {
        console.error('Erreur lors de la récupération des locations', error);
        this.vehicleRentals = [];  // En cas d'erreur, initialise avec un tableau vide
      }
    );
  }



  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchVehicleRentals();  // Recharger la page suivante
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.fetchVehicleRentals();  // Recharger la page précédente
    }
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
  // Ouvrir le formulaire de mise à jour pour le véhicule sélectionné




  onSidenavOpenedChange(isOpened: boolean) {
    console.log("Sidenav Opened:", isOpened);
  }

  onSidenavClosedStart() {
    console.log("Sidenav Closed");
  }

}
