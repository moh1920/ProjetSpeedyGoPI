import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ChatListComponent} from "../components/chat-list/chat-list.component";
import {ChatResponse} from "./models/chat-response";
import {MessageResponse} from "./models/message-response";
import {ChatService} from "./services/chat.service";
import {KeycloakService} from "../utils/keycloak/keycloak.service";
import {MessageRequest} from "./models/message-request";
import {Notification} from "./models/notification";
import {EmojiData} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {SafetyContentService} from "../components/blog-form/services/safety-content.service";
import {ToastrService} from "ngx-toastr";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {FooterComponent} from "../components/footer/footer.component";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {UserService} from "../services/services/user.service";
@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    ChatListComponent,
    NgIf,
    DatePipe,
    PickerComponent,
    GoogleMap,
    MapMarker,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements  OnInit, OnDestroy, AfterViewChecked {
  selectedChat: ChatResponse = {};
  chats: Array<ChatResponse> = [];
  chatMessages: Array<MessageResponse> = [];
  socketClient: any = null;
  messageContent: string = '';
  showEmojis = false;
  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef<HTMLDivElement>;
  private notificationSubscription: any;

  showLocation: boolean = false;
  id:number;
  constructor(
    private chatService: ChatService,
    private keycloakService: KeycloakService,
    private safetyContentService:SafetyContentService,
    private toastService:ToastrService,
    private router:ActivatedRoute,
    private userService:UserService
  ) {
  }
  message: { type: string, text: string } = { type: '', text: '' };



  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.socketClient !== null) {
      this.socketClient.disconnect();
      this.notificationSubscription.unsubscribe();
      this.socketClient = null;
    }
  }

  ngOnInit(): void {
    this.id=this.router.snapshot.params['id'];
    this.initWebSocket();
    this.getAllChats();
  }



  chatSelected(chatResponse: ChatResponse) {
    this.selectedChat = chatResponse;
    this.getAllChatMessages(chatResponse.id as string);
    this.setMessagesToSeen();
    this.selectedChat.unreadCount = 0;
  }

  isSelfMessage(message: MessageResponse): boolean {
    return message.senderId === this.keycloakService.userId;
  }

  sendMessage() {
    if (!this.messageContent?.trim()) {
      console.warn("Message vide, rien à envoyer.");
      return;
    }

    this.safetyContentService.analyzeText(this.messageContent).subscribe({
      next: (analysis) => {
        const flaggedCategories = analysis.categoriesAnalysis.filter(item => item.severity > 0);

        if (flaggedCategories.length > 0) {

          this.message = {
            type: 'error',
            text: `Inappropriate message detected : ${flaggedCategories.map(item => item.category).join(', ')}`
          };
          this.toastService.error(this.message.text, this.message.type);

          return;
        }

        // Si OK, envoi du message
        const messageRequest: MessageRequest = {
          chatId: this.selectedChat.id,
          senderId: this.getSenderId(),
          receiverId: this.getReceiverId(),
          content: this.messageContent,
          type: 'TEXT',
        };

        this.chatService.saveMessage(messageRequest).subscribe({
          next: () => {
            const message: MessageResponse = {
              senderId: this.getSenderId(),
              receiverId: this.getReceiverId(),
              content: this.messageContent,
              type: 'TEXT',
              state: 'SENT',
              createdAt: new Date().toString()
            };
            this.selectedChat.lastMessage = this.messageContent;
            this.chatMessages.push(message);
            this.messageContent = '';
            this.showEmojis = false;
          },
          error: (error) => {
            console.error("Erreur lors de l'envoi du message:", error);
            this.message = {
              type: 'error',
              text: "Erreur lors de l'envoi du message. Veuillez réessayer."
            };
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de l'analyse du message:", error);
        this.message = {
          type: 'error',
          text: "Erreur lors de l'analyse du contenu. Veuillez réessayer."
        };
      }
    });
  }


  keyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  onSelectEmojis(emojiSelected: any) {
    const emoji: EmojiData = emojiSelected.emoji;
   this.messageContent += emoji.native;
  }

  onClick() {
    this.setMessagesToSeen();
  }

  uploadMedia(target: EventTarget | null) {
    const file = this.extractFileFromTarget(target);
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {

          const mediaLines = reader.result.toString().split(',')[1];

          this.chatService.uploadMedia(
             this.selectedChat.id as string,

             file

          ).subscribe({
            next: () => {
              const message: MessageResponse = {
                senderId: this.getSenderId(),
                receiverId: this.getReceiverId(),
                content: 'Attachment',
                type: 'IMAGE',
                state: 'SENT',
                media: [mediaLines],
                createdAt: new Date().toString()
              };
              this.chatMessages.push(message);
            }
          });
        }
      }
      reader.readAsDataURL(file);
    }
  }

  logout() {
    this.keycloakService.logout();
  }

  userProfile() {
    this.keycloakService.accountManagement();
  }

  private setMessagesToSeen() {
    this.chatService.setMessagesToSeen(
   this.selectedChat.id as string
    ).subscribe({
      next: () => {
      }
    });
  }

  private getAllChats() {
    this.chatService.getChatsByReceiver()
      .subscribe({
        next: (res) => {
          this.chats = res;
        }
      });
  }

  private getAllChatMessages(chatId: string) {
    this.chatService.getAllMessages(
       chatId
    ).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
      }
    });
  }

  private initWebSocket() {
    if (this.keycloakService.keycloak?.tokenParsed?.sub) {
      let ws = new SockJS('http://localhost:8020/ws');
      this.socketClient = Stomp.over(ws);
      const subUrl = `/user/${this.keycloakService.keycloak.tokenParsed?.sub}/chat`;
      this.socketClient.connect({'Authorization': 'Bearer ' + this.keycloakService.keycloak.token},
        () => {
          this.notificationSubscription = this.socketClient.subscribe(subUrl,
            (message: any) => {
              const notification: Notification = JSON.parse(message.body);
              this.handleNotification(notification);

            },
            () => console.error('Error while connecting to webSocket')
          );
        }
      );
    }
  }



  private handleNotification(notification: Notification) {
    if (!notification) return;
    if (this.selectedChat && this.selectedChat.id === notification.chatId) {
      switch (notification.type) {
        case 'MESSAGE':
        case 'IMAGE':
          const message: MessageResponse = {
            senderId: notification.senderId,
            receiverId: notification.receiverId,
            content: notification.content,
            type: notification.messageType,
            media: notification.media,
            createdAt: new Date().toString()
          };
          if (notification.type === 'IMAGE') {
            this.selectedChat.lastMessage = 'Attachment';
          } else {
            this.selectedChat.lastMessage = notification.content;
          }
          this.chatMessages.push(message);
          break;
        case 'SEEN':
          this.chatMessages.forEach(m => m.state = 'SEEN');
          break;
      }
    } else {
      const destChat = this.chats.find(c => c.id === notification.chatId);
      if (destChat && notification.type !== 'SEEN') {
        if (notification.type === 'MESSAGE') {
          destChat.lastMessage = notification.content;
        } else if (notification.type === 'IMAGE') {
          destChat.lastMessage = 'Attachment';
        }
        destChat.lastMessageTime = new Date().toString();
        destChat.unreadCount! += 1;
      } else if (notification.type === 'MESSAGE') {
        const newChat: ChatResponse = {
          id: notification.chatId,
          senderId: notification.senderId,
          receiverId: notification.receiverId,
          lastMessage: notification.content,
          name: notification.chatName,
          unreadCount: 1,
          lastMessageTime: new Date().toString()
        };
        this.chats.unshift(newChat);
      }
    }
  }

  private getSenderId(): string {
    if (this.selectedChat.senderId === this.keycloakService.userId) {
      return this.selectedChat.senderId as string;
    }
    return this.selectedChat.receiverId as string;
  }

  private getReceiverId(): string {
    if (this.selectedChat.senderId === this.keycloakService.userId) {
      return this.selectedChat.receiverId as string;
    }
    return this.selectedChat.senderId as string;
  }

  private scrollToBottom() {
    if (this.scrollableDiv) {
      const div = this.scrollableDiv.nativeElement;
      div.scrollTop = div.scrollHeight;
    }
  }

  private extractFileFromTarget(target: EventTarget | null): File | null {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files[0];
  }


  ////////////////
  markerPosition: google.maps.LatLngLiteral | null = null;
  center: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 }; // par défaut : Tunis
  zoom = 12;

  selectedAddress: string = '';


  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.markerPosition = { lat, lng };
      this.center = this.markerPosition;

      this.fetchAddress(lat, lng);
    }
  }

  fetchAddress(lat: number, lng: number): void {
    const apiKey = 'AIzaSyCidD4GBkYXMcyDIRWWUhfkZHT9noeXXzE';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.results.length > 0) {
          this.selectedAddress = data.results[0].formatted_address;
        } else {
          console.error('Aucune adresse trouvée pour cette position.');
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel à l\'API de géocodage:', error);
      });
  }


  sendLocationMessage(): void {
    if (!this.selectedChat?.id || !this.markerPosition) {
      console.error('Chat ou position non définis.');
      return;
    }

    const message: MessageRequest = {
      content: 'Position partagée',
      senderId: this.getSenderId(),
      receiverId: this.selectedChat.receiverId,
      chatId: this.selectedChat.id,
      type: 'LOCATION',
      lat: this.markerPosition.lat,
      lng: this.markerPosition.lng,
      address: this.selectedAddress
    };

    this.chatService.sendLocationMessage(message).subscribe({
      next: () => {
        this.messageContent = '';
        this.markerPosition = null;
        this.selectedAddress = '';
        this.showLocation=false;
        this.getAllChatMessages(this.selectedChat.id!);
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du message de localisation:', err);
      }
    });
  }
  mediaRecorder: any;
  audioChunks: any[] = [];
  recordedAudioUrl: string | null = null;

  private canStopRecording = false;

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

        if (audioBlob.size < 1000) {
          console.warn("Audio trop court, non envoyé.");
          return;
        }

        const file = new File([audioBlob], 'voice_message.webm', { type: 'audio/webm' });
        this.recordedAudioUrl = URL.createObjectURL(audioBlob);

        if (this.selectedChat?.id && this.getSenderId() && this.getReceiverId()) {
          this.chatService.sendVoiceMessage(
            this.selectedChat.id,
            file,
            this.getSenderId(),
            this.getReceiverId()
          ).subscribe({
            next: () => console.log('Voice message sent'),
            error: err => console.error('Send failed', err)
          });
        }
      };

      this.mediaRecorder.start();
      this.canStopRecording = false;
      setTimeout(() => this.canStopRecording = true, 500);
    });
  }

  stopRecording() {
    if (this.mediaRecorder && this.canStopRecording) {
      this.mediaRecorder.stop();
    } else {
      console.warn("Enregistrement trop court");
    }
  }


}
