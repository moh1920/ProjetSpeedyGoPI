import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleRequestService {

  private readonly apiUrl = 'http://localhost:8020/api/keycloak';

  constructor(private http: HttpClient) {}

  requestRole(userId: string, requestedRole: 'DRIVER' | 'PARTNER'): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('requestedRole', requestedRole);
    return this.http.post(this.apiUrl + '/request', null, { params, responseType: 'text' });
  }

  approveRole(userId: string, approvedRole: 'DRIVER' | 'PARTNER'): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('approvedRole', approvedRole);
    return this.http.post(this.apiUrl + '/approve', null, { params, responseType: 'text' });
  }

  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  rejectRequest(userId: string): Observable<string> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<string>(`${this.apiUrl}/reject`, { params });
  }

}
