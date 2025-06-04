import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {StringResponse} from "../models/string-response";
import {ChatResponse} from "../models/chat-response";
import {MessageRequest} from "../models/message-request";
import {MessageResponse} from "../models/message-response";
import {UserResponse} from "../models/user-response";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8020/api/v1/chats';

  constructor(private http:HttpClient) { }

  createChat(senderId: string, receiverId: string): Observable<{ response: string }> {
    const params = new HttpParams()
      .set('sender-id', senderId)
      .set('receiver-id', receiverId);

    return this.http.post<{ response: string }>(this.apiUrl, null, { params });
  }

  getChatsByReceiver():Observable<any>{
    return this.http.get(this.apiUrl);
  }
  private apiUrlMessages = 'http://localhost:8020/api/v1/messages';


  saveMessage(message: MessageRequest): Observable<void> {
    return this.http.post<void>(this.apiUrlMessages, message);
  }

  uploadMedia(chatId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('chat-id', chatId);
    formData.append('file', file);

    return this.http.post<void>(`${this.apiUrlMessages}/upload-media`, formData);
  }

  setMessagesToSeen(chatId: string): Observable<void> {
    const params = new HttpParams().set('chat-id', chatId);
    return this.http.patch<void>(this.apiUrlMessages, null, { params });
  }

  getAllMessages(chatId: string): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.apiUrlMessages}/chat/${chatId}`);
  }

  private apiUrlUser = 'http://localhost:8020/api/v1/users';


  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrlUser);
  }

  sendLocationMessage(locationMessageRequest: MessageRequest): Observable<void> {
    return this.http.post<void>("http://localhost:8020/api/v1/messages/location", locationMessageRequest);
  }

  sendVoiceMessage(
    chatId: string,
    voiceFile: File,
    senderId: string,
    receiverId: string
  ): Observable<string> {
    const formData = new FormData();
    formData.append('file', voiceFile);
    formData.append('senderId', senderId);
    formData.append('receiverId', receiverId);

    return this.http.post(`http://localhost:8020/api/v1/messages/${chatId}`, formData, {
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error sending voice message:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
