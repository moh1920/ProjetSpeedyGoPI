import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MaintenanceCountDTO} from "../models/MaintenanceCountDTO";
import {VehicleUsageStatsDTO} from "../models/VehicleUsageStatsDTO";
import {CustomerRentalStats} from "../models/CustomerRentalStats";
import { MonthlyTrend} from "../models/rental-statistics.model";


@Injectable({
  providedIn: 'root'
})
export class StatService {

  private apiUrl = 'http://localhost:8020/gestionStation';  // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir les statistiques des clients


  // Méthode pour obtenir la durée moyenne en minutes
  avgDurationMinutes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rental/avgDurationMinutes`);
  }



  private getMaintenanceCountPAth = 'http://localhost:8020/gestionStation/maintenance/getMaintenanceCountPerVehicle'; // à adapter si nécessaire



  getMaintenanceCount(): Observable<MaintenanceCountDTO[]> {
    return this.http.get<MaintenanceCountDTO[]>(this.getMaintenanceCountPAth);
  }


  private getVehicleUsageAndMaintenanceStatsPath = 'http://localhost:8020/gestionStation/maintenance/getVehicleUsageAndMaintenanceStats';  // L'URL de votre API backend


  // Méthode pour récupérer les statistiques
  getVehicleUsageAndMaintenanceStats(): Observable<VehicleUsageStatsDTO[]> {
    return this.http.get<VehicleUsageStatsDTO[]>(this.getVehicleUsageAndMaintenanceStatsPath);
  }


  private getCustomerStatsPath = 'http://localhost:8020/gestionStation/rental/getCustomerStats';

  getCustomerStats(): Observable<CustomerRentalStats[]> {
    return this.http.get<CustomerRentalStats[]>(`${this.getCustomerStatsPath}`);
  }



  private compareMonthlyAvgDurationsPath = 'http://localhost:8020/gestionStation/rental/avgDurationMinutes';


  compareMonthlyAvgDurations(): Observable<MonthlyTrend[]> {
    return this.http.get<MonthlyTrend[]>(`${this.compareMonthlyAvgDurationsPath}`);
  }


}
