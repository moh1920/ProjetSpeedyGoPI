import {Component, OnInit} from '@angular/core';
import { FooterStationTemplateComponent } from '../pageHome/footer-station-template/footer-station-template.component';
import {NavbarComponent} from "../../../../components/navbar/navbar.component";
import {FooterComponent} from "../../../../components/footer/footer.component";
import {VehicleRentalControllerService} from "../../../../services/services/vehicle-rental-controller.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {VehicleRental} from "../../../../services/models/vehicle-rental";
import {RentalControllerService} from "../../../../services/services/rental-controller.service";
import {RentalDTO} from "../../../../services/models/rental.dto";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-detais-scooter-or-bike',
  imports: [FooterStationTemplateComponent, NavbarComponent, FooterComponent, DatePipe, NgIf, TableModule, RouterLink, NgClass, NgForOf],
  templateUrl: './detais-scooter-or-bike.component.html',
  standalone: true,
  styleUrl: './detais-scooter-or-bike.component.scss'
})
export class DetaisScooterOrBikeComponent implements OnInit{

  vehicleId !: number ;
  vehicleRental ! : VehicleRental ;
  rentalList : RentalDTO[] ;

  constructor(private serviceVehicleRental : VehicleRentalControllerService ,
              private activatedRoute : ActivatedRoute,
              private serviceRental : RentalControllerService) {
  }

  ngOnInit(): void {
  this.vehicleId = this.activatedRoute.snapshot.params['id'];
  this.getVehicleRentalById(this.vehicleId);
  this.getAllRentalByVehicle(this.vehicleId);
  }

  getVehicleRentalById(id : any){
    this.serviceVehicleRental.getByIdVehicleRental({id}).subscribe(data =>{
      this.vehicleRental = data  as VehicleRental ;
      console.log(this.vehicleRental);
    })
  }

  getAllRentalByVehicle(id : any){
    this.serviceRental.getAllRentalByVehicle(id).subscribe(data =>{
      this.rentalList = data as RentalDTO[] ;
      console.log(this.rentalList);
    })
  }

   calculateTotalDistance() {
    if ( this.rentalList.length === 0) return 0;
    return this.rentalList.reduce((sum, rental) => sum + rental.distanceTraveled, 0).toFixed(1);
  }

   calculateTotalRevenue() {
     if ( this.rentalList.length === 0) return 0;
    return this.rentalList.reduce((sum, rental) => sum + rental.cost, 0).toFixed(2);
  }
   calculateAvgDuration() {
    if (!this.rentalList || this.rentalList.length === 0) return 0;

    const totalHours = this.rentalList.reduce((sum, rental) => {
      const start = new Date(rental.startTime);
      const end = new Date(rental.endTime);
      const durationHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return sum + durationHrs;
    }, 0);

    return (totalHours / this.rentalList.length).toFixed(1);
  }
   countActiveRentals() {
    if (!this.rentalList || this.rentalList.length === 0) return 0;
    return this.rentalList.filter(rental => rental.rentalStatus).length;
  }















}
