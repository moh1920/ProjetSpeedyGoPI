import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private readonly baseUrl = 'http://localhost:8020/stats';

  constructor(private http: HttpClient) {}

  getGlobalPromotionStats(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/getGlobalPromotionStats`);
  }


  getActiveLoyaltyPrograms(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/activeLoyaltyPrograms`);
  }

  getUsersWhoWonPointsCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/usersWonPoints`);
  }

  getUsersWhoWonPromosCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/usersWonPromotions`);
  }

  getTop5LoyalUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/top5LoyalUsers`);
  }

}
