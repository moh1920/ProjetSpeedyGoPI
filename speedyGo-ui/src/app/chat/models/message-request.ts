export interface MessageRequest {
  chatId?: string;
  content?: string;
  receiverId?: string;
  senderId?: string;
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LOCATION';
  lat?: number;
  lng?: number;
  address?: string;
}

