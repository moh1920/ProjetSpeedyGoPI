import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {VehicleRentalControllerService} from "../../../services/services/vehicle-rental-controller.service";
import {VehicleRental} from "../../../services/models/vehicle-rental";

import {HomeComponent} from "../../home/home.component";
import {AppFormsComponent} from "../../ui-components/forms/forms.component";
import {AppTopstripComponent} from "../../../layouts/full/top-strip/topstrip.component";
import {Dir} from "@angular/cdk/bidi";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NgScrollbarModule} from "ngx-scrollbar";
import {SidebarComponent} from "../../../layouts/full/sidebar/sidebar.component";
import {RouterLink} from "@angular/router";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatCard} from "@angular/material/card";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {HeaderComponent} from "../../../layouts/full/header/header.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-form-vehicle-rental',
  imports: [AppFormsComponent, ReactiveFormsModule, AppTopstripComponent, Dir, MatIcon, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, NgScrollbarModule, SidebarComponent, RouterLink, MatLabel, MatError, MatCard, MatOption, MatSelect, MatFormField, MatInput, MatButton, HeaderComponent, MatSidenavContent, NgIf],
  templateUrl: './form-vehicle-rental.component.html',
  styleUrl: './form-vehicle-rental.component.scss',
  standalone: true ,
})
export class FormVehicleRentalComponent {
  vehicleRentalForm!: FormGroup;
  successMessage: string = '';

  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`
  constructor(private fb: FormBuilder, private vehicleRentalService: VehicleRentalControllerService,
              private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.vehicleRentalForm = this.fb.group({
      id: [null],
      batteryLevel: [null, [Validators.min(0), Validators.max(100)]],
      mileage: [null, [Validators.min(0)]],
      qrCode: [''],
      status: ['', Validators.required],
      typeVehicleRental: ['', Validators.required],
      lastMaintenanceDate: [''],
      createdAt: [''],
      updatedAt: ['']
    });
  }
  onSubmit(): void {
    if (this.vehicleRentalForm.valid) {
      let vehicleRentalData: VehicleRental = this.vehicleRentalForm.value;

      // Conversion des dates au format ISO
      if (   vehicleRentalData.createdAt) {
        vehicleRentalData.createdAt = new Date(vehicleRentalData.createdAt).toISOString();
      }

      if (vehicleRentalData.updatedAt) {
        vehicleRentalData.updatedAt = new Date(vehicleRentalData.updatedAt).toISOString();
      }

      if (vehicleRentalData.lastMaintenanceDate) {
        vehicleRentalData.lastMaintenanceDate = new Date(vehicleRentalData.lastMaintenanceDate).toISOString();
      }

      this.vehicleRentalService.addVehicleRental({ body: vehicleRentalData }).subscribe({
        next: (response) => {
          console.log('Véhicule ajouté avec succès:', response);
          this.successMessage = 'Véhicule ajouté avec succès !';
          this.vehicleRentalForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout:', error);
        }
      });
    }
  }
  onSidenavOpenedChange(isOpened: boolean) {
    console.log("Sidenav Opened:", isOpened);
  }

  onSidenavClosedStart() {
    console.log("Sidenav Closed");
  }
}
