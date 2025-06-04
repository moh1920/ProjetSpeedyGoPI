export interface MessageResponse {
  id?: number;
  content?: string;
  createdAt?: string;
  media?: Array<string>;
  receiverId?: string;
  senderId?: string;
  state?: 'SENT' | 'SEEN';
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LOCATION';
  lat?: number;
  lng?: number;
  address?: string;
}
