/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { Vehicule } from '../models/vehicule';
export interface Stationdelevery {
  capacity: number;
  contactNumber: string;
  contactPerson: string;
  id?: number;
  isActive: boolean;
  latitude: number;
  location: string;
  longitude: number;
  name: string;
  vehicles?: Array<Vehicule>;
  workingHours: string;
}
