import { Component } from '@angular/core';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
