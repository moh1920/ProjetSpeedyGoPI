import {Component, input, InputSignal, OnInit, output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {UserResponse} from "../../chat/models/user-response";
import {ChatService} from "../../chat/services/chat.service";
import {GravatarPipe} from "../../chat/pipes/gravatar.pipe";
import {ChatResponse} from "../../chat/models/chat-response";
import {UserService} from "../../services/services/user.service";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-chat-list',
  imports: [
    FormsModule,
    DatePipe,
    NgIf,
    NgForOf,
    GravatarPipe,
    NgClass
  ],
  templateUrl: './chat-list.component.html',
  standalone: true,
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent implements OnInit{
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact = false;
  contacts: Array<UserResponse> = [];
  chatSelected = output<ChatResponse>();
  id:string|null;
   contactById: UserResponse;


  constructor(
    private chatService: ChatService,
    private keycloakService: KeycloakService,
  private router:ActivatedRoute

) {
  }



  searchContact() {
    this.chatService.getAllUsers()
      .subscribe({
        next: (users) => {
          this.contacts = users;
          if (this.id !== null) {

            this.contacts.forEach(contact => {
              if (contact.id == this.id) {
                this.contactById = contact;
                console.log("contaccccccccccccccccccct",this.contactById);

              }
            });
          }
          console.log(this.contacts);
          this.searchNewContact = true;
        }
      });
  }


  selectContact(contact: UserResponse) {
    this.chatService.createChat(
      this.keycloakService.userId as string,
       contact.id as string
    ).subscribe({
      next: (res) => {
        const chat: ChatResponse = {
          id: res.response,
          name: contact.firstName + ' ' + contact.lastName,
          recipientOnline: contact.online,
          lastMessageTime: contact.lastSeen,
          senderId: this.keycloakService.userId,
          receiverId: contact.id
        };
        this.chats().unshift(chat);
        this.searchNewContact = false;
        this.chatSelected.emit(chat);
      }
    });

  }

  chatClicked(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }

  wrapMessage(lastMessage: string | undefined): string {
    if (lastMessage && lastMessage.length <= 20) {
      return lastMessage;
    }
    return lastMessage?.substring(0, 17) + '...';
  }

  trackChat(index: number, chat: any): any {
    return chat.id || index;
  }

  trackContact(index: number, contact: any): any {
    return contact.id || index;
  }

  ngOnInit(): void {
    this.id=this.router.snapshot.params['id'];


  }



}
