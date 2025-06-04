import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Station } from "../../../../services/models/station";
import { StationControllerService } from "../../../../services/services/station-controller.service";
import { GoogleMapsModule } from "@angular/google-maps";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../layouts/full/header/header.component';
import { SidebarComponent } from '../../../../layouts/full/sidebar/sidebar.component';
import { AppTopstripComponent } from '../../../../layouts/full/top-strip/topstrip.component';
import { NgForOf, NgIf } from "@angular/common";
import {MatListItem, MatNavList} from "@angular/material/list";
import {NgScrollbarModule} from "ngx-scrollbar";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatDialog} from "@angular/material/dialog";
import {BsModalRef} from "ngx-bootstrap/modal";
import {SearchStationPipe} from "../../pipe/pipes/search-station.pipe";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-station-vehicle-list',
  templateUrl: './station-vehicle-list.component.html',
  styleUrls: ['./station-vehicle-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    AppTopstripComponent,
    NgForOf,
    NgIf,
    MatListItem,
    MatNavList,
    NgScrollbarModule,
    SearchStationPipe,
    FormsModule

  ],
})
export class StationVehicleListComponent implements OnInit {

  @ViewChild("stationDetailsModal") stationDetailsModal!: TemplateRef<any>
  modalRef?: BsModalRef
  stations: Station[] = [];

  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // Position centrale (Tunis)
  zoom = 12;
  selectedStation: Station | null = null;

  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`
  searchText: string= '';

  constructor(private stationService: StationControllerService,private breakpointObserver: BreakpointObserver,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchStationVehicle();

    // Détecter si l'écran est mobile et ajuster la sidebar
    this.breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isOver = result.matches;
    });
  }

  fetchStationVehicle() {
    this.stationService.getAllStation().subscribe({
      next: (data) => {
        console.log("Les stations récupérées :", data);
        this.stations = data as Station[];
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des stations:', error);
      }
    });
  }

  selectStation(station: Station) {
    this.selectedStation = station;
  }

  deleteStation(stationId: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette station ?')) {
      this.stationService.deleteStation({ id: stationId }).subscribe({
        next: () => {
          console.log('Station supprimée avec succès');
          this.fetchStationVehicle(); // Recharger les stations après suppression
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la station', error);
        }
      });
    }
  }

  openStationModal(station: any) {
    this.selectedStation = station;
    this.dialog.open(this.stationDetailsModal, {
      width: '600px',
      data: station
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }



}
