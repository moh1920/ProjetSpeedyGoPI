import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarStationManagementComponent } from '../nav-bar-station-management/nav-bar-station-management.component';
import { SectionformRentalComponent } from '../sectionform-rental/sectionform-rental.component';
import { AboutScootieComponent } from '../about-scootie/about-scootie.component';
import { ExperienceComponent } from '../experience/experience.component';
import { CollectionScooterBikeComponent } from '../collection-scooter-bike/collection-scooter-bike.component';
import { GalleryRentalComponent } from '../gallery-rental/gallery-rental.component';
import { CustomersFeedbackComponent } from '../customers-feedback/customers-feedback.component';
import { BlogAndArticlesComponent } from '../blog-and-articles/blog-and-articles.component';
import { FooterStationTemplateComponent } from '../footer-station-template/footer-station-template.component';
import {NavbarComponent} from "../../../../../components/navbar/navbar.component";
import {FooterComponent} from "../../../../../components/footer/footer.component";
@Component({
  selector: 'app-home-rental-scooter',
  imports: [RouterOutlet, NavBarStationManagementComponent, SectionformRentalComponent, AboutScootieComponent, ExperienceComponent, CollectionScooterBikeComponent, GalleryRentalComponent, CustomersFeedbackComponent, BlogAndArticlesComponent, FooterStationTemplateComponent, NavbarComponent, FooterComponent],
  templateUrl: './home-rental-scooter.component.html',
  standalone: true,
  styleUrl: './home-rental-scooter.component.scss'
})
export class HomeRentalScooterComponent {

}
