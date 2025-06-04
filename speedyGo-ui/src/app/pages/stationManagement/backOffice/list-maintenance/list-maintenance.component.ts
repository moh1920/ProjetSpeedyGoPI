import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MaintenanceControllerService } from "../../../../services/services/maintenance-controller.service";
import { Maintenance } from "../../../../services/models/maintenance";
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {Router, RouterModule} from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {CommonModule, DecimalPipe} from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import {SidebarComponent} from "../../../../layouts/full/sidebar/sidebar.component";
import {AppTopstripComponent} from "../../../../layouts/full/top-strip/topstrip.component";
import {HeaderComponent} from "../../../../layouts/full/header/header.component";
import {AppNavItemComponent} from "../../../../layouts/full/sidebar/nav-item/nav-item.component";
import {FormsModule} from "@angular/forms";
import {NgbDropdownModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {addMaintenance} from "../../../../services/fn/maintenance-controller/add-maintenance";
import { MatDialog } from '@angular/material/dialog';
import { VehicleRentalControllerService } from 'src/app/services/services';
import { VehicleRental } from 'src/app/services/models';
import {SearchMaintenancePipe} from "../../pipe/pipes/search-maintenance.pipe";
import {StatComponentComponent} from "../stat-component/stat-component.component";
import {Paginator} from "primeng/paginator";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {Menu} from "primeng/menu";
import {ButtonDirective} from "primeng/button";
import {PaginatedVehicleRentalResponse} from "../../../../services/models/PaginatedVehicleRentalResponse";
import {MaintenanceDTO} from "../../../../services/models/MaintenanceDTO";

@Component({
  selector: 'app-list-maintenance',
  templateUrl: './list-maintenance.component.html',
  styleUrls: ['./list-maintenance.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    AppNavItemComponent,
    AppTopstripComponent,
    MatListModule,
    NgScrollbarModule,
    SidebarComponent,
    AppTopstripComponent,
    HeaderComponent,
    FormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    DecimalPipe,
    SearchMaintenancePipe,
    StatComponentComponent,
    Paginator,
    PrimeTemplate,
    TableModule,
    Menu,
    ButtonDirective

  ],
})
export class ListMaintenanceComponent implements OnInit {
  displayedColumns: string[] = ['id', 'maintenanceType', 'scheduledDate', 'technicianName', 'cost', 'status', 'actions'];
  maintenances: MaintenanceDTO[] = [];
  successMessage: string = '';

  // Intégration de la barre latérale
  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`
  vehicleAll: VehicleRental[];

  constructor(private maintenanceService: MaintenanceControllerService
    , private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              private vehicleControllerService: VehicleRentalControllerService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadMaintenances();
  }


  totalRecords: number = 0;  // Total des enregistrements
  rows: number = 10;         // Nombre d'éléments par page
  first: number = 0;         // Premier élément de la page
  sortBy: string = 'id';     // Tri par défaut
  sortOrder: string = 'ASC'; // Ordre de tri par défaut
  loading: boolean = false;  // Indicateur de chargement


  // Charger la liste des maintenances
  loadMaintenances(): void {
    this.loading = true;  // Active l'indicateur de chargement

    // Appel de l'API pour obtenir les maintenances
    this.maintenanceService.getMaintenances(
      this.first / this.rows,
      this.rows,
      this.sortBy,
      this.sortOrder
    ).subscribe(
      response => {
        this.maintenances = response.content;  // Les données paginées
        this.totalRecords = response.totalElements;  // Total des enregistrements
        this.loading = false;  // Désactive l'indicateur de chargement
      },
      error => {
        console.error('Error loading maintenances', error);
        this.loading = false;  // Désactive également en cas d'erreur
      }
    );
  }

  // Supprimer une maintenance
  deleteMaintenance(id: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?')) {
      this.maintenanceService.deleteMaintenance({id: id}).subscribe({
        next: () => {
          this.successMessage = "Maintenance supprimée avec succès !";
          this.loadMaintenances();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la maintenance:', error);
        }
      });
    }
  }

  protected readonly addMaintenance = addMaintenance;


  @ViewChild('vehicleMaintenanceModal') vehicleMaintenanceModal!: TemplateRef<any>;
  maintenanceSelected: any;
  selectedVehicleId: null;
  searchText: string = '';
  size: number = 10;
  totalElements: number = 0;


  fetchAllVehicleRental(): void {
    this.loading = true;
    this.vehicleControllerService.getAllVehicleRentalSimple({}).subscribe({
      next: (response: PaginatedVehicleRentalResponse) => {
        this.vehicleAll = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des véhicules', error);
        this.vehicleAll = [];
        this.totalElements = 0;
        this.loading = false;
      }
    });
  }


  openAssignVehicleModal(maintenance: any) {
    if (!maintenance) {
      console.error("Erreur : maintenance non définie !");
      return;
    }

    this.maintenanceSelected = maintenance;
    this.selectedVehicleId = null;
    this.fetchAllVehicleRental();

    if (!this.vehicleMaintenanceModal) {
      console.error("Erreur : vehicleMaintenanceModal non trouvé !");
      return;
    }

    this.dialog.open(this.vehicleMaintenanceModal, {
      width: '600px',
      data: {maintenance: this.maintenanceSelected},
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  assignVehicleToMaintenance() {
    if (!this.selectedVehicleId) {
      alert("Veuillez sélectionner un véhicule.");
      return;
    }

    if (!this.maintenanceSelected || !this.maintenanceSelected.id) {
      console.error("Erreur : Aucune maintenance sélectionnée !");
      alert("Aucune maintenance sélectionnée.");
      return;
    }


    this.maintenanceService.affectMaintenanceToVehicle({
      idMaintenance: this.maintenanceSelected.id,
      idVehicle: this.selectedVehicleId
    }).subscribe({
      next: () => {
        alert("Véhicule assigné avec succès !");
        this.closeModal();
      },
      error: (error) => {
        const errorMessage = error?.error || "Une erreur est survenue.";
        alert(errorMessage);
      }
    });
  }


  onPageChange(event: any): void {
    this.first = event.first;  // Index de la première ligne de la page
    this.rows = event.rows;    // Nombre d'éléments par page
    this.loadMaintenances();   // Recharger les maintenances
  }

  onSortChange(event: any): void {
    this.sortBy = event.sortField;  // Champ de tri
    this.sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';  // Ordre de tri (ASC ou DESC)
    this.loadMaintenances();  // Recharger les maintenances
  }


  generateCsvFile() {
    this.maintenanceService.generateCsv().subscribe({
      next: (message) => {
        alert(message);
      },
      error: (error) => {
        console.error("Erreur lors de la génération du CSV :", error);
        alert("Erreur lors de la génération du CSV.");
      }
    });
  }



  downloadExcelFile() {
    this.maintenanceService.downloadExcel().subscribe({
      next: (data) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = globalThis.URL.createObjectURL(blob); //
        const a = document.createElement('a');
        a.href = url;
        a.download = 'maintenance.xlsx';
        a.click();
        globalThis.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error("Erreur lors du téléchargement du fichier Excel :", error);
        alert("Erreur lors du téléchargement du fichier Excel.");
      }
    });
  }


  get filterMaintenance() {
    if (!this.searchText) {
      return this.maintenances;
    }

    const lowerSearch = this.searchText.toLowerCase();
    return this.maintenances.filter(maintenance =>
      maintenance.maintenanceType.toLowerCase().includes(lowerSearch) ||
      maintenance.emailTechnician.toLowerCase().includes(lowerSearch) ||
      maintenance.status?.toLowerCase().includes(lowerSearch) ||
      maintenance.technicianName.toLowerCase().includes(lowerSearch) ||
      maintenance.cost?.toLocaleString().toLowerCase().includes(lowerSearch)
    );
  }

}
