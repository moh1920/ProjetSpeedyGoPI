import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {VehicleRental} from "../../../services/models/vehicle-rental";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleRentalServiceService {
  private apiUrl = `http://localhost:8020/gestionStation/vehicleRental/addVehicleRental`;
  constructor(private http: HttpClient) {}

  // Méthode pour ajouter une location de véhicule
  addVehicleRental(vehicleRental: VehicleRental): Observable<any> {

    return this.http.post<any>(this.apiUrl, vehicleRental);
  }
}
