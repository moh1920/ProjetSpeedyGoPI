import {Component, OnInit} from '@angular/core';
import {RentalDTO} from "../../../../services/models/rental.dto";
import {RentalControllerService} from "../../../../services/services/rental-controller.service";
import {FormBuilder, FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {VehicleRentalControllerService} from "../../../../services/services/vehicle-rental-controller.service";
import {GoogleMap, MapMarker, MapPolyline} from "@angular/google-maps";
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../../../../components/navbar/navbar.component";
import {FooterComponent} from "../../../../components/footer/footer.component";

@Component({
  selector: 'app-trip-recommandation-componant',
  imports: [
    GoogleMap,
    MapMarker,
    NgIf,
    MapPolyline,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './trip-recommandation-componant.component.html',
  standalone: true,
  styleUrl: './trip-recommandation-componant.component.scss'
})
export class TripRecommandationComponantComponent implements OnInit {
  rentalRecommandation: RentalDTO;
  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // Position centrale (Tunis)
  zoom = 12;
  idRental!: number;
  polyline: string | null = null;
  errorMessage: string = '';
  decodedPath: google.maps.LatLngLiteral[] = [];
  weather: any;


  constructor(
    private  serviceRentalVehicle : RentalControllerService ,
    private fb: FormBuilder,
    private route : ActivatedRoute,
    public dialog: MatDialog,
    private serviceVehicleRental : VehicleRentalControllerService,
    private router : Router,

  ) {

  }

  ngOnInit(): void {
    this.idRental = this.route.snapshot.params['id'];
    console.log("id : " + this.idRental);

    this.getWeather();

    this.serviceRentalVehicle.getRentalByIds(this.idRental).subscribe((data) => {
      this.rentalRecommandation = data as RentalDTO;
      console.log("Recommandation reçue:", this.rentalRecommandation);

      this.getRecommendedRoute(this.idRental);
    });
  }


  getRecommendedRoute(idRental: number): void {
    console.log(">>> getRecommendedRoute() appelée avec id:", idRental); // AJOUT ICI
    this.serviceRentalVehicle.getRecommendedRoute(idRental).subscribe({
      next: (polyline: string) => {
        console.log('Polyline reçue du backend:', polyline);
        this.polyline = polyline;
        this.displayRouteOnMap(polyline);
      },
      error: (error) => {
        this.errorMessage = 'Failed to get route: ' + error.message;
      }
    });
  }


  displayRouteOnMap(polyline: string): void {
    if (polyline) {
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
      console.log("Décodé:", decodedPath);

      this.decodedPath = decodedPath.map(coord => ({
        lat: coord.lat(),
        lng: coord.lng()
      }));
    }
  }


  getWeather() {
    this.serviceRentalVehicle.getWeatherBetweenStations(this.idRental).subscribe({
      next: data => {
        this.weather = data;
      },
      error: err => {
        console.error('Erreur lors de la récupération de la météo:', err);
        alert("Erreur lors de la récupération de la météo.");
      }
    });
  }
  customerRental(){
    this.router.navigate(['/customerScooterBike'])
  }
}
