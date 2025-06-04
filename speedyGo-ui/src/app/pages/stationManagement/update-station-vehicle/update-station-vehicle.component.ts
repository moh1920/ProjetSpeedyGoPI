import { Component, OnInit } from '@angular/core';
import { StationControllerService } from "../../../services/services/station-controller.service";
import { ActivatedRoute, Router } from "@angular/router";
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Station } from "../../../services/models/station";
import {GoogleMapsModule} from "@angular/google-maps";
import {NgIf} from "@angular/common";  // Importer le modèle Station

@Component({
  selector: 'app-update-station-vehicle',
  templateUrl: './update-station-vehicle.component.html',
  styleUrls: ['./update-station-vehicle.component.scss'],
  standalone: true,
  imports: [
    GoogleMapsModule,
    NgIf,
    ReactiveFormsModule,
  ]
})
export class UpdateStationVehicleComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };  // Coordonnées par défaut (exemple : San Francisco)
  zoom: number = 12;
  markerPosition: google.maps.LatLngLiteral | undefined;
  successMessage: string | undefined;
  stationSelection!: Station;
  stationId!: any;
  stationForm: FormGroup;  // Formulaire réactif

  constructor(
    private serviceStation: StationControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
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
      (data: Station) => {
        this.stationSelection = data;

        // Vérifier si lat et lng sont définis et mettre à jour la carte
        if (this.stationSelection) {
          console.log("Patching form with:", this.stationForm);

          this.stationForm.patchValue({
            name: this.stationSelection.name,
            location: this.stationSelection.location,
            latitude: this.stationSelection.latitude,
            longitude: this.stationSelection.longitude,
            capacity: this.stationSelection.capacity,
            is_active: this.stationSelection.is_active,
          });

          // Vérifiez si latitude et longitude sont définis avant de les utiliser
          if (this.stationSelection.latitude !== undefined && this.stationSelection.longitude !== undefined) {
            this.center = { lat: this.stationSelection.latitude, lng: this.stationSelection.longitude };
            this.markerPosition = { lat: this.stationSelection.latitude, lng: this.stationSelection.longitude };
          } else {
            console.error('Latitude ou longitude non définie pour la station');
          }
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
    this.serviceStation.updateStation({ body: this.stationSelection }).subscribe(
      () => {
        alert("Mise à jour réussie !");
        this.router.navigate(["/stationVehicleList"]);  // Utilisez `navigate()` pour rediriger l'utilisateur
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la station:', error);
        alert('Erreur lors de la mise à jour de la station');
      }
    );
  }

  // Gestion du clic sur la carte pour déplacer le marqueur
  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON(); // Assurez-vous que latLng n'est pas null
      this.center = this.markerPosition;  // Mettre à jour le centre de la carte
    }
    this.successMessage = 'Marker placed successfully!';
  }
}
