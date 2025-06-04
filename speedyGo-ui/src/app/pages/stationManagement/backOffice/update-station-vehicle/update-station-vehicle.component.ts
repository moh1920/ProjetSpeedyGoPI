import {Component, OnInit, ViewChild} from '@angular/core';
import { StationControllerService } from "../../../../services/services/station-controller.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {GoogleMapsModule} from "@angular/google-maps";
import {NgIf} from "@angular/common";
import {AppTopstripComponent} from "../../../../layouts/full/top-strip/topstrip.component";
import {Dir} from "@angular/cdk/bidi";
import {HeaderComponent} from "../../../../layouts/full/header/header.component";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NgScrollbarModule} from "ngx-scrollbar";
import {SidebarComponent} from "../../../../layouts/full/sidebar/sidebar.component";
import {BreakpointObserver} from "@angular/cdk/layout";  // Importer le modèle Station

@Component({
  selector: 'app-update-station-vehicle',
  templateUrl: './update-station-vehicle.component.html',
  styleUrls: ['./update-station-vehicle.component.scss'],
  standalone: true,
  imports: [
    GoogleMapsModule,
    NgIf,
    ReactiveFormsModule,
    AppTopstripComponent,
    Dir,
    HeaderComponent,
    MatIcon,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NgScrollbarModule,
    SidebarComponent,
    RouterLink,
  ]
})
export class UpdateStationVehicleComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };  // Coordonnées par défaut (exemple : San Francisco)
  zoom: number = 12;
  markerPosition: google.maps.LatLngLiteral | undefined;
  successMessage: string | undefined;
  stationId!: any;
  stationForm: FormGroup;  // Formulaire réactif



  constructor(
    private serviceStation: StationControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,

  ) {}

  ngOnInit(): void {
    this.stationId = this.route.snapshot.params['id'];  // Récupérer l'ID de la station
    this.createForm();
    this.getStation();  // Charger les données de la station

  }

  // Créer le formulaire réactif
  createForm(): void {
    this.stationForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      capacity: ['', Validators.required],
      is_active: [false],
    });
  }

  // Charger les données de la station
  getStation(): void {
    this.serviceStation.getByIdStation({ id: this.stationId }).subscribe(
      (data) => {
        this.stationForm.patchValue(data);

        // Vérifiez si les coordonnées sont définies avant de les utiliser
        if (this.stationForm.value.latitude !== undefined && this.stationForm.value.longitude !== undefined) {
          this.center = {
            lat: this.stationForm.value.latitude,
            lng: this.stationForm.value.longitude
          };
          this.markerPosition = {
            lat: this.stationForm.value.latitude,
            lng: this.stationForm.value.longitude
          };
        } else {
          console.error('Latitude ou longitude non définie pour la station');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la station:', error);
        alert('Erreur lors de la récupération des données de la station');
      }
    );
  }


  // Méthode pour mettre à jour la station
  updateStation(): void {
    console.log('Données du formulaire avant mise à jour:', this.stationForm.value);
    this.serviceStation.updateStation({ idStation: this.stationId , body: this.stationForm.value }).subscribe(
      () => {
        alert("Mise à jour réussie !");
        this.router.navigate(["/stationVehicleList"]);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la station:', error);
        alert('Erreur lors de la mise à jour de la station');
      }
    );
  }


  getAddress(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        this.stationForm.patchValue({ location: results[0].formatted_address });
      } else {
        console.warn('Aucune adresse trouvée pour ces coordonnées.');
      }
    });
  }
  // Gestion du clic sur la carte pour déplacer le marqueur
  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.stationForm.patchValue({
        latitude: this.markerPosition.lat,
        longitude: this.markerPosition.lng
      });

      this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
    }
  }

  onCancel() {
  this.router.navigate(['/stationVehicleList'])
  }
}
