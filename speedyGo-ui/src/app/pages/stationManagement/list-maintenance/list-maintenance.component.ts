import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceControllerService } from "../../../services/services/maintenance-controller.service";
import { Maintenance } from "../../../services/models/maintenance";
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import {SidebarComponent} from "../../../layouts/full/sidebar/sidebar.component";
import {AppTopstripComponent} from "../../../layouts/full/top-strip/topstrip.component";
import {HeaderComponent} from "../../../layouts/full/header/header.component";
import {AppNavItemComponent} from "../../../layouts/full/sidebar/nav-item/nav-item.component";

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
    HeaderComponent
  ],
})
export class ListMaintenanceComponent implements OnInit {
  displayedColumns: string[] = ['id', 'maintenanceType', 'scheduledDate', 'technicianName', 'cost', 'status', 'actions'];
  maintenances: Maintenance[] = [];
  successMessage: string = '';

  // Intégration de la barre latérale
  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`

  constructor(private maintenanceService: MaintenanceControllerService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.loadMaintenances();

    // Détecter si l'écran est mobile et ajuster la sidebar
    this.breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isOver = result.matches;
    });
  }

  // Charger la liste des maintenances
  loadMaintenances(): void {
    this.maintenanceService.getAllMaintenance().subscribe({
      next: (data) => {
        this.maintenances = data as Maintenance[];
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des maintenances:', error);
      }
    });
  }

  // Supprimer une maintenance
  deleteMaintenance(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?')) {
      this.maintenanceService.deleteMaintenance({id:id}).subscribe({
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

  // Gestion de la barre latérale
  onSidenavOpenedChange(isOpened: boolean) {
    console.log("Sidenav Opened:", isOpened);
  }

  onSidenavClosedStart() {
    console.log("Sidenav Closed");
  }
}
