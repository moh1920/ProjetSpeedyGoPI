import { Component, AfterViewInit, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { Socket } from "net";
import { KeycloakService } from "../../utils/keycloak/keycloak.service";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { IMessage } from '@stomp/stompjs';
import { CommonModule } from '@angular/common';

interface Notification {
  message?: string;
  timestamp?: string;
  status?: string;
  read?: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  SocketClient: any = null;
  private notification: any;
  private userEmail: string;
  unreadenotificationCount = 0;
  notificationss: Array<Notification> = [];
  showNotifications = false;

  constructor(private KeycloakService: KeycloakService) {
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    
    // Close dropdown when clicking outside
    if (this.showNotifications) {
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdown);
      }, 0);
    }
  }

  closeDropdown = (event: MouseEvent) => {
    const dropdown = document.querySelector('.dropdown-menu');
    const button = document.getElementById('notificationDropdown');
    
    if (dropdown && button && 
        !dropdown.contains(event.target as Node) && 
        !button.contains(event.target as Node)) {
      this.showNotifications = false;
      document.removeEventListener('click', this.closeDropdown);
    }
  }

  markAsRead(index: number) {
    if (this.notificationss[index]) {
      this.notificationss[index].read = true;
      if (this.unreadenotificationCount > 0) {
        this.unreadenotificationCount--;
      }
    }
  }

  ngOnInit() {

    
    if (this.KeycloakService.keycloak.tokenParsed?.sub) {
      this.userEmail = this.KeycloakService.userEmail;

      const ws = new SockJS('http://localhost:8020/ws');
      this.SocketClient = Stomp.over(ws);

      this.SocketClient.connect(
        { 'Authorization': 'Bearer ' + this.KeycloakService.keycloak.token },
        () => {
          console.log('✅ Connected to SocketClient');
          this.notification = this.SocketClient.subscribe(
            `/user/${this.KeycloakService.userEmail}/notifications`,
            (message: IMessage) => {
              const notification = JSON.parse(message.body);
              if (notification) {
                this.notificationss.unshift(notification);
                this.unreadenotificationCount++;
              }
            }
          );
        }
      );
    }
  }

  ngAfterViewInit() {
    // No need for Bootstrap initialization with our manual approach
  }
}
