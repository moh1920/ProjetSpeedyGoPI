import {Component, ViewChild} from '@angular/core';
import {Sidebar} from "primeng/sidebar";
import {Button} from "primeng/button";
import {Avatar} from "primeng/avatar";
import {PrimeTemplate} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {StyleClass} from "primeng/styleclass";

@Component({
  selector: 'app-nav-forum',
  imports: [
    Button,
    Avatar,
    Sidebar,
    PrimeTemplate,
    Ripple,
    StyleClass
  ],
  templateUrl: './nav-forum.component.html',
  standalone: true,
  styleUrl: './nav-forum.component.scss'
})
export class NavForumComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }


  sidebarVisible: boolean = false;
}
