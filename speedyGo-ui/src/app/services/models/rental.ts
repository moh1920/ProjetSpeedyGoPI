/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import {Station} from "./station";
import {User} from "./user";
import {VehicleRental} from "./vehicle-rental";

export interface Rental {

  cost: number;
  distanceTraveled: number;
  endTime?: string;
  id?: number;
  startTime?: string;
  startingPoint?: Station ;
  destination?: Station ;
  customer?: User ;
  vehicleRental?: VehicleRental ;
  rentalStatus?:boolean;
}
