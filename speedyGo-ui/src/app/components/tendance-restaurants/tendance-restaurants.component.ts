import { Component, OnInit } from '@angular/core';
import { TendanceRestaurantsService } from './tendance-restaurants.service';
import { NgForOf, NgIf } from '@angular/common';
import {NavbarComponent} from "../navbar/navbar.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-tendance-restaurants',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './tendance-restaurants.component.html',
  styleUrl: './tendance-restaurants.component.scss'
})
export class TendanceRestaurantsComponent implements OnInit {

  restaurants: any[] = [];
  pagedRestaurants: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(private restaurantService: TendanceRestaurantsService) { }

  ngOnInit(): void {
    const lat = 36.898892;
    const lng = 10.190184;

    this.restaurantService.getTendanceRestaurants(lat, lng).subscribe({
      next: (data) => {
        this.restaurants = data.results.sort((a:any, b:any) => (b.rating ?? 0) - (a.rating ?? 0));
        this.updatePagedRestaurants();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants:', err);
      }
    });
  }

  updatePagedRestaurants(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedRestaurants = this.restaurants.slice(start, end);
  }

  changePage(page: number): void {
    const maxPage = Math.ceil(this.restaurants.length / this.itemsPerPage);
    if (page >= 1 && page <= maxPage) {
      this.currentPage = page;
      this.updatePagedRestaurants();
    }
  }

  protected readonly Math = Math;
}
