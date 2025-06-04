import {VehicleRental} from "./vehicle-rental";

export interface PaginatedVehicleRentalResponse {
  content: VehicleRental[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
