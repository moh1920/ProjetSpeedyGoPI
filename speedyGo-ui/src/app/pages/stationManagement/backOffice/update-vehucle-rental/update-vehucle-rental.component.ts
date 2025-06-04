import {Component, OnInit, ViewChild} from '@angular/core';
import {VehicleRental} from "../../../../services/models/vehicle-rental";
import {VehicleRentalControllerService} from "../../../../services/services/vehicle-rental-controller.service";
import {ActivatedRoute, Router, RouterEvent, RouterLink} from "@angular/router";
import {DatePipe, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AppTopstripComponent} from "../../../../layouts/full/top-strip/topstrip.component";
import {Dir} from "@angular/cdk/bidi";
import {HeaderComponent} from "../../../../layouts/full/header/header.component";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NgScrollbarModule} from "ngx-scrollbar";
import {SidebarComponent} from "../../../../layouts/full/sidebar/sidebar.component";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-update-vehicle-rental',
  imports: [
    NgIf,
    DatePipe,
    ReactiveFormsModule,
    AppTopstripComponent,
    Dir,
    HeaderComponent,
    MatButton,
    MatCard,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatListItem,
    MatNavList,
    MatOption,
    MatSelect,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NgScrollbarModule,
    SidebarComponent,
    RouterLink
  ],
  templateUrl: './update-vehucle-rental.component.html',
  styleUrl: './update-vehucle-rental.component.scss',
  standalone: true,
})
export class UpdateVehicleRentalComponent implements OnInit{
  vehicleRental!: VehicleRental; // Déclaration de la variable vehicleRentall
  successMessage : string = '' ;
  id = 0 ;
  vehicleRentalForm !: FormGroup ;


  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`
  constructor(
    private serviceVehicleRental: VehicleRentalControllerService, // Service pour récupérer les données
    private route: ActivatedRoute,
    private router : Router ,
    private breakpointObserver: BreakpointObserver,
    private fb : FormBuilder// Utilisation de Router pour récupérer les paramètres
  ) {}



  ngOnInit(): void {
    // Récupérer l'ID de l'URL
    this.id = this.route.snapshot.params['id'];
    this.createForm() ;
    console.log('ID récupéré depuis l\'URL :', this.id);

    // Utilisez l'ID pour récupérer les données du véhicule
    this.fetchVehicleRental();
  }


  createForm(){
    this.vehicleRentalForm = this.fb.group({
      id: [null],
      batteryLevel: [null, [Validators.min(0), Validators.max(100)]],
      mileage: [null, [Validators.min(0)]],
      models : ['', Validators.required],
      costOfVehicleByKm :['', Validators.required],
      qrCode: [''],
      status: ['', Validators.required],
      typeVehicleRental: ['', Validators.required],
      lastMaintenanceDate: [''],
      createdAt: [''],
      updatedAt: ['']
    });
  }


  fetchVehicleRental(): void {
    if (this.id) {
      this.serviceVehicleRental.getByIdVehicleRental({id :this.id}).subscribe({
        next: (response) => {
          console.log('Véhicule récupéré :', response);
          this.vehicleRentalForm.patchValue(response);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du véhicule', error);
        }
      });
    }
  }
  updateVehicleRental(){
    if (this.vehicleRentalForm.invalid){
      return ;
    }
    const updatedVehicleRental = this.vehicleRentalForm.value;
    console.log("before update" , updatedVehicleRental);
    this.serviceVehicleRental.updateVehicleRental({  idVehicle: this.id ,body: updatedVehicleRental }).subscribe({
      next: (data) => {
        this.successMessage = 'Maintenance mise à jour avec succès !';
        console.log("before update" , data);

        this.router.navigate(['/VehicleRentalList']);  // Rediriger vers la liste après mise à jour
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la maintenance:', error);
        alert('Erreur lors de la mise à jour de la maintenance');
      }
    });
  }




  onCancel() {
    this.router.navigate(['/VehicleRentalList'])
  }
}
