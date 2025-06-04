import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
export interface CategoryAnalysis {
  category: 'Hate' | 'SelfHarm' | 'Sexual' | 'Violence';
  severity: number;
}

export interface AnalyzeTextResult {
  categoriesAnalysis: CategoryAnalysis[];
  blocklistsMatch: any[]; // You can type this better if you know its structure
}
@Injectable({
  providedIn: 'root'
})
export class SafetyContentService {


  private apiUrl = 'http://localhost:8020/azure/content/analyze';

  constructor(private http: HttpClient) {}

  analyzeText(text: string): Observable<AnalyzeTextResult> {
    return this.http.post<AnalyzeTextResult>(this.apiUrl, text, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
