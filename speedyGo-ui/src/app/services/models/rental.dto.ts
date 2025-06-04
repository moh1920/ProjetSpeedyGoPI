import {Station} from "./station";

export interface RentalDTO {
  id: number;
  startTime: string;
  endTime: string;
  cost: number;
  distanceTraveled: number;
  startingPointName: Station;
  destinationName: Station;
  customerName: string;
  customerEmail: string;
  vehicleModel: string;
  rentalStatus:boolean;
}
