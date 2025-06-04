import { Injectable } from '@angular/core';
import {VehicleRentalControllerService} from "../../../services/services/vehicle-rental-controller.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomVehicleRentalService {


  /**
   * Récupère le QR Code et convertit le blob en URL d'image
   */
  /**
   * Récupère la première URL du QR Code dans la réponse
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère l'image du QR Code en tant que Blob et la convertit en URL
   */
  getVehiculeQrCode(vehicleId: number): Observable<string> {
    const url = `http://localhost:8020/gestionStation/vehicleRental/${vehicleId}/qrcode`;

    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)) // 🔹 Convertir le Blob en URL
    );
  }
}
