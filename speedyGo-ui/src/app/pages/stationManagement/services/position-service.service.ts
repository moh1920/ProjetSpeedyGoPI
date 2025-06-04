import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PositionServiceService {

  constructor(private http: HttpClient) {}


  getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject('Geolocation not supported');
      }
    });
  }

  sendPositionToBackend(lat: number, lng: number) {
    return this.http.post<any>('http://localhost:8020/gestionStation/rental/nearest-station', {
      latitude: lat,
      longitude: lng
    });
  }



}
