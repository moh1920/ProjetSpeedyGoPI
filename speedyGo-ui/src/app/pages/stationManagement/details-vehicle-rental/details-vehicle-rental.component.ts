import { Component, OnInit } from '@angular/core';
import { VehicleRentalControllerService } from "../../../services/services/vehicle-rental-controller.service";
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleRental } from "../../../services/models/vehicle-rental";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-details-vehicle-rental',
  templateUrl: './details-vehicle-rental.component.html',
  styleUrls: ['./details-vehicle-rental.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    DatePipe
  ]
})
export class DetailsVehicleRentalComponent implements OnInit {
  vehicleRental!: VehicleRental;
  vehicleId!: number;

  constructor(
    private serviceVehicleRental: VehicleRentalControllerService,
    private router: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.router.snapshot.params['id'];
    this.detailsVehicleRental();
  }

  detailsVehicleRental(): void {
    if (this.vehicleId) {
      this.serviceVehicleRental.getByIdVehicleRental({ id: this.vehicleId }).subscribe({
        next: (data) => {
          this.vehicleRental = data;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des détails du véhicule', error);
        }
      });
    }
  }

  goBack(): void {
    this.route.navigate(['/VehicleRentalList']); // Exemple de redirection vers la liste des véhicules
  }
}
