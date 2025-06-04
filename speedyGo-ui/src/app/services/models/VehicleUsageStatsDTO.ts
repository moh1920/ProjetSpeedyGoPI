export interface VehicleUsageStatsDTO {
  vehicleId: number;
  rentalCount: number;
  mileage: number;
  lastMaintenance: Date; // On peut utiliser string pour la date, ou la manipuler avec un objet Date si nécessaire
}
