import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserResponse} from "../../../chat/models/user-response";
export interface Reward {
  id?: number;
  rewordName: string;
}
export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
}
export interface SpinHistoryWithUserDTO {
  spinHistory: SpinHistory;
  userDTO: UserDTO;
}

export interface SpinHistory {
  id: number;
  userId: string;
  spinDate: string;
  reward: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpinService {

  private baseUrl = 'http://localhost:8020/api/weekly-spin';

  constructor(private http: HttpClient) {}


  saveReward(reward: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/saveReward`, null, {
      params: { reward }
    });
  }



  getStatus(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/status`);
  }


  getItems(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/items`);
  }


  spin(): Observable<string> {
    return this.http.post(`${this.baseUrl}/play`, null, { responseType: 'text' });
  }

  getSpinHistoriesThisWeek(): Observable<SpinHistoryWithUserDTO[]> {
    return this.http.get<SpinHistoryWithUserDTO[]>(this.baseUrl + '/this-week');
  }
}
