import { Injectable } from '@angular/core';
import {LoyaltyProgramDTO} from "../model/LoyaltyProgram";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LoyaltyProgram} from "../../../services/models/loyalty-program";

@Injectable({
  providedIn: 'root'
})
export class LoyaltyProgramService {

  constructor(private http: HttpClient) {}

  getAllLoyaltyPrograms(): Observable<LoyaltyProgramDTO[]> {
    return this.http.get<LoyaltyProgramDTO[]>("http://localhost:8020/pv/loyaltyPrograms");
  }
  deleteLoyaltyProgram(idProgram: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8020/pv/loyaltyProgram/${idProgram}`);
  }
  getLoyaltyProgramById(id: number): Observable<LoyaltyProgramDTO> {
    return this.http.get<LoyaltyProgramDTO>(`http://localhost:8020/pv/loyaltyProgramDetails/${id}`);
  }
}
