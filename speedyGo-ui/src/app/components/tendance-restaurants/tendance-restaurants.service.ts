import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TendanceRestaurantsService {

  private baseUrl = 'http://localhost:8020/api/restaurants'; // ou ton domaine backend

  constructor(private http: HttpClient) { }

  getTendanceRestaurants(lat: number, lng: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString());

    return this.http.get(`${this.baseUrl}/tendance`, { params });
  }
}
