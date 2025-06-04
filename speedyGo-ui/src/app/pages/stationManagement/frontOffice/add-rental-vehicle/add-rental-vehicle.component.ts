import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Station} from "../../../../services/models/station";
import {StationControllerService} from "../../../../services/services/station-controller.service";
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Rental} from "../../../../services/models/rental";
import {RentalControllerService} from "../../../../services/services/rental-controller.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {NavbarComponent} from "../../../../components/navbar/navbar.component";
import {FooterComponent} from "../../../../components/footer/footer.component";
import {VehicleRental} from "../../../../services/models/vehicle-rental";
import {VehicleRentalControllerService} from "../../../../services/services/vehicle-rental-controller.service";
import {RentalDTO} from "../../../../services/models/rental.dto";
import Swal from 'sweetalert2';



@Component({
  selector: 'app-add-rental-vehicle',
  imports: [
    GoogleMap,
    MapMarker,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './add-rental-vehicle.component.html',
  styleUrl: './add-rental-vehicle.component.scss',
  standalone : true,
})
export class AddRentalVehicleComponent implements OnInit{
  stations : Station[] = [] ;
  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // Position centrale (Tunis)
  zoom = 12;
  selectedStation: Station | null = null;
  rentalForm: FormGroup;
  idVehicle : any ;
  rentalDate !: Rental ;
  startStationId: any;
  endStationId: any;
  private coste: {};
  vehicleRental !: VehicleRental ;
  currentStationId !: number | undefined;
  filteredStations: Station[] = [] ;
  rentalRecommandation !: Rental ;
  startStation !: Station ;
  endStation !: Station ;
   isMapEnabled: boolean ;


  ngOnInit(): void {
    this.fetchStationVehicle();
    this.idVehicle = this.route.snapshot.params['id'];
    this.getVehicleRental(this.idVehicle);
  }


  @ViewChild('modaleStationAffected') modaleStationAffected!: TemplateRef<any>;

  @ViewChild('modaleRecommendationTrip') modaleRecommendationTrip!: TemplateRef<any>;




  constructor(private stationService: StationControllerService ,
              private fb: FormBuilder,
              private serviceRentalVehicle : RentalControllerService ,
              private route : ActivatedRoute,
                public dialog: MatDialog,
                private serviceVehicleRental : VehicleRentalControllerService,

    ) {
    this.rentalForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });

  }

  onSubmit() {
    const startTime = this.rentalForm.get('startTime')?.value;
    const endTime = this.rentalForm.get('endTime')?.value;

    // ✅ Vérif avec alerte stylée
    if (new Date(endTime) <= new Date(startTime)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Time',
        text: 'End time must be after start time!',
        confirmButtonColor: '#dc3545' // rouge Bootstrap
      });
      return;
    }

    if (this.rentalForm.valid) {
      this.serviceRentalVehicle.addRental({ body: this.rentalForm.value }).subscribe({
        next: (response) => {
          this.rentalDate = response as Rental;
          console.log('Rental added successfully', response);

          const rentalId = this.rentalDate.id;
          if (rentalId) {
            this.serviceRentalVehicle.affecterVehicleRentalToRental({
              idVehicleRental: this.idVehicle,
              idRental: rentalId
            }).subscribe({
              next: () => {
                console.log('Affected vehicle successfully');
                Swal.fire({
                  title: 'Rental Successful ✅',
                  text: 'Vehicle has been successfully rented.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#198754' // vert Bootstrap
                });
                this.isMapEnabled = true;
              },
              error: (err) => {
                console.error('Error affecting vehicle:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Affectation Error',
                  text: err?.error || 'Error affecting vehicle',
                  confirmButtonColor: '#dc3545'
                });
              }
            });
          } else {
            console.error("Rental ID is undefined!");
            Swal.fire({
              icon: 'error',
              title: 'Rental ID Missing',
              text: 'Vehicle not affected: Rental ID is undefined!',
              confirmButtonColor: '#dc3545'
            });
          }
        },
        error: (error) => {
          console.error("Error adding rental:", error);
          Swal.fire({
            icon: 'error',
            title: 'Rental Error',
            text: error?.error || 'Error adding rental',
            confirmButtonColor: '#dc3545'
          });
        }
      });
    }
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



  openMadaleStation(station: Station) {
    if (!station) {
      console.error("Erreur : maintenance non définie !");
      return;
    }

    this.selectedStation = station;
    this.dialog.open(this.modaleStationAffected,{
      width : '600px',
      data : station
    })

  }
  closeModel(){
    this.dialog.closeAll() ;
  }


  affecterStartStation(id: any) {
    this.endStationId = id;


    if (this.rentalForm.valid && this.rentalDate?.id) {
      this.serviceRentalVehicle.affecterStationStartRental({
        rentalId: this.rentalDate.id,
      idStartStation: id
    }).subscribe({
        next: () => console.log("Start station affected"),
        error: (err) => console.error("Error affecting start station:", err),
      });
    } else {
      console.error("Form is invalid or rental ID is missing!");
    }
  }

  affecterEndStation(id: any) {
    this.endStationId = id;

    if (this.rentalForm.valid && this.rentalDate?.id) {
      this.serviceRentalVehicle.affecterStationDestinationRental({
        rentalId: this.rentalDate.id,
        idDestination: id
      }).subscribe({
        next: () => {
          console.log("End station affected");
          this.closeModel();
          Swal.fire({
            icon: 'success',
            title: 'Station Assigned',
            text: 'End station has been successfully assigned ✅',
            confirmButtonColor: '#198754'
          });
        },
        error: (err) => {
          console.error("Error affecting end station:", err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error || 'Error affecting end station',
            confirmButtonColor: '#dc3545'
          });
        }
      });
    } else {
      console.error("Form is invalid or rental ID is missing!");
      Swal.fire({
        icon: 'warning',
        title: 'Missing Info',
        text: 'Form is invalid or rental ID is missing!',
        confirmButtonColor: '#ffc107'
      });
    }
  }
  onCalculateCost(idRental: number | undefined) {
    const rentalId = idRental ?? 0;  // fallback si idRental est undefined
    console.log('Calculating cost for rental ID:', rentalId);

    this.serviceRentalVehicle.calculCostOfRental(rentalId).subscribe(
      (cost) => {
        console.log('Cost calculated:', cost);
        Swal.fire({
          title: 'Coût calculé 🚲',
          text: `The total cost is: ${cost} DT. A confirmation has been sent to your email address.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#198754' // vert Bootstrap
        });
      },
      (error) => {
        console.error('Error calculating cost:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur de calcul',
          text: error?.error || 'Erreur lors du calcul du coût.',
          confirmButtonColor: '#dc3545'
        });
      }
    );
  }

  getVehicleRental(id: number){
      this.serviceVehicleRental.getByIdVehicleRental({id}).subscribe(data =>{
        this.vehicleRental = data as VehicleRental ;
        this.currentStationId = this.vehicleRental.station?.id;
        console.log("Id Station : "+this.currentStationId);
        this.filterStations();
      })
  }


  private filterStations() {
    this.filteredStations = this.stations.filter(s => s.id !== this.currentStationId)
  }



}
