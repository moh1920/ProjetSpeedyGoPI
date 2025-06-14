/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import {Station} from "./station";

export interface VehicleRental {
  batteryLevel?: number;
  createdAt?: string;
  id?: number;
  lastMaintenanceDate?: string;
  mileage: number;
  qrCode?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  typeVehicleRental: 'BIKE' | 'SCOOTER';
  updatedAt?: string;
  models?: string ;
  station?: Station ;
  costOfVehicleByKm?: number ;
  imageUrl?: string ;
}
