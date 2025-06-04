import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modèles pour les données du sondage
export interface Poll {
  id: number;
  question: string;
  options: any[];
  active: boolean;
}

export interface PollResponse {
  pollId: number;
  userId: number;
  selectedOptions: number[];
}
export interface PollResponseRequest {
  pollId: number;
  selectedOptionIds: number[];
}
export interface PollCreateRequest {
  poll: NewPoll;
  options: string[];
}
export interface NewPoll {
  question: string;
}


export interface PollResponseRequest {
  pollId: number;
  //user: any;  // Remplace par ton type d'utilisateur
  selectedOptionIds: number[];
}

export interface PollResults {
  [key: string]: number; // clé : option, valeur : nombre de votes
}

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private apiUrl = 'http://localhost:8020/api/polls';  // L'URL de ton backend

  constructor(private http: HttpClient) { }

  // Créer un sondage
  createPoll(pollCreateRequest: PollCreateRequest): Observable<Poll> {
    return this.http.post<Poll>(`${this.apiUrl}/create`, pollCreateRequest);
  }

  // Soumettre une réponse à un sondage
  // Dans poll.service.ts, ajoutez cette méthode si elle n'existe pas déjà
  submitPollResponse(request: PollResponseRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-response`, request);
  }

  // Récupérer tous les sondages actifs
  getActivePolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.apiUrl}/active`);
  }

  // Récupérer les résultats d'un sondage
  getPollResults(pollId: number): Observable<PollResults> {
    return this.http.get<PollResults>(`${this.apiUrl}/results/${pollId}`);
  }
}
