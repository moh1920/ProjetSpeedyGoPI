import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { PositionServiceService } from "../../services/position-service.service";
import { GoogleMap, MapMarker } from "@angular/google-maps";
import { HttpClient } from "@angular/common/http";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {StationControllerService} from "../../../../services/services/station-controller.service";
import {Station} from "../../../../services/models/station";
import {MatDialog} from "@angular/material/dialog";
import {Router, RouterLink} from "@angular/router";
import {VehicleRentalControllerService} from "../../../../services/services/vehicle-rental-controller.service";
import {VehicleRental} from "../../../../services/models/vehicle-rental";
import {Paginator} from "primeng/paginator";
import {NavbarComponent} from "../../../../components/navbar/navbar.component";
import {FooterComponent} from "../../../../components/footer/footer.component";
import {RentalControllerService} from "../../../../services/services/rental-controller.service";
import {RentalDTO} from "../../../../services/models/rental.dto";

@Component({
  selector: 'app-custmer-profile-rental',
  standalone: true,
  imports: [
    GoogleMap,
    MapMarker,
    NgForOf,
    NgClass,
    RouterLink,
    Paginator,
    NavbarComponent,
    FooterComponent,
    DatePipe,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './custmer-profile-rental.component.html',
  styleUrl: './custmer-profile-rental.component.scss'
})
export class CustmerProfileRentalComponent implements OnInit {
  @ViewChild("stationDetailsModal") stationDetailsModal!: TemplateRef<any>


  @ViewChild(GoogleMap) mapElement!: GoogleMap;

  directionsRenderer: google.maps.DirectionsRenderer | undefined;
  directionsService = new google.maps.DirectionsService();


  page: number = 0;
  size: number = 10;
  totalElements: number;


  zoom = 15;

  // Carte centrée sur Tunis par défaut
  mapCenter: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 };

  // Marqueurs à afficher
  markers: any[] = [];

  nearestStation !: Station ;
   vehicleOnStation : VehicleRental[] = [];
   first: any;
   rentalByCustomer: RentalDTO[] = [];

  constructor(
    private positionService: PositionServiceService,
    private http: HttpClient,
    private stationService : StationControllerService,
    private dialog: MatDialog,
    private vehicleService : VehicleRentalControllerService,
    private rentalService : RentalControllerService,
    private router : Router ,
  ) {}

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.mapCenter = userPos;

        // Ajouter le marqueur utilisateur
        this.markers.push({
          position: userPos,
          label: {
            color: 'red',
            text: 'Vous êtes ici'
          },
          title: 'Votre position'
        });
      });
    }

    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.getAllRentalByCustomer();
  }

  get map(): google.maps.Map {
    return this.mapElement.googleMap!;
  }


  getPositionAndNearestStation() {
    navigator.geolocation.getCurrentPosition(position => {
      const userCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.http.post<any>('http://localhost:8020/gestionStation/rental/nearest-station', {
        latitude: userCoords.lat,
        longitude: userCoords.lng
      }).subscribe({
        next: res => {
          console.log('Station la plus proche 📍:', res);
          this.nearestStation = res;

          this.markers = [
            {
              position: userCoords,
              label: { color: 'red', text: 'Vous êtes ici' },
              title: 'Votre position'
            },
            {
              position: { lat: res.latitude, lng: res.longitude },
              label: { color: 'blue' +
                  '', text: res.name },
              title: res.name,
            }
          ];

          // Centrer sur la station
          this.mapCenter = {
            lat: res.latitude,
            lng: res.longitude
          };

          // Affichage de l'itinéraire
          this.directionsRenderer?.setMap(this.map);

          this.directionsService.route({
            origin: userCoords,
            destination: { lat: res.latitude, lng: res.longitude },
            travelMode: google.maps.TravelMode.DRIVING
          }, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              this.directionsRenderer?.setDirections(response);
            } else {
              console.error('Erreur itinéraire 🚫:', status);
            }
          });
        },
        error: err => {
          console.error('Erreur côté Angular :', err);
        }
      });
    });
  }


  openStationModal() {
    this.dialog.open(this.stationDetailsModal, {
      width: '600px',
      data: this.nearestStation
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }



  getVehiclesFromRecommendedStation() {
    if (!this.nearestStation?.id) return;

    this.vehicleService.getAllVehicleOnStation(this.nearestStation.id)
      .subscribe({
        next: data => {
          this.vehicleOnStation = data;
          console.log('🚗 Véhicules disponibles:', this.vehicleOnStation);
        },
        error: err => {
          console.error('Erreur récupération véhicules ❌:', err);
        }
      });
  }

  onPageChange(event: any): void {
    this.first = event.first;  // La première ligne de la page actuelle
    this.size = event.rows;    // Le nombre de lignes par page
    this.getVehiclesFromRecommendedStation();  // Recharge les données avec les nouveaux paramètres de pagination
  }

  getAllRentalByCustomer(){
    this.rentalService.getAllRentalByCustomer().subscribe((data) =>{
      this.rentalByCustomer = data ;
      console.log(this.rentalByCustomer);
    })
  }


  goToRentalDetails(rentalId: number): void {
    this.router.navigate(['/TripRecommandationComponantComponent', rentalId]);
  }
  listScooterbiker(){
    this.router.navigate(['/scooterBikeList']);

  }

}
