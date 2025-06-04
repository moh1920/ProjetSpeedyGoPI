import { Injectable } from '@angular/core';
import {Store} from "./services/models/store";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private baseUrl = 'http://localhost:8020/store';
  constructor(private http: HttpClient) {}



  // Créer un store en envoyant FormData avec les fichiers
  createStore(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }


  getStoreById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateStore(id: number, store: Store) {
    return this.http.put<Store>(`${this.baseUrl}/${id}`, store);
  }

  deleteStore(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  duplicatePost(postId: number): Observable<any> {
    const url = `http://localhost:8020/posts/${postId}/duplicate`;
    return this.http.post(url,{});
  }
}
