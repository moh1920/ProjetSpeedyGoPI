import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';




@Component({
  selector: 'app-speedy-go-plus',
  imports: [NavbarComponent, FooterComponent,RouterModule],
    templateUrl: './speedy-go-plus.component.html',
  styleUrl: './speedy-go-plus.component.scss'
})

export class SpeedyGoPlusComponent {
  activeIndex: number = 0; 

  plans = [
    { id: 1, name: 'Basic', description: 'Essential Plan', price: 50, benefits: ['10 Rides/Month', '5% Discount on Food', 'Basic Support'] },
    { id: 2, name: 'Standard', description: 'Popular Plan', price: 100, benefits: ['20 Rides/Month', '10% Discount on Food', 'Priority Support'] },
    { id: 3, name: 'Premium', description: 'All-Inclusive Plan', price: 150, benefits: ['Unlimited Rides', '15% Discount on Food', '24/7 Premium Support'] },
    { id: 4, name: 'Ultimate', description: 'Exclusive Plan', price: 200, benefits: ['Unlimited Rides & Deliveries', '20% Discount on All Services', 'Concierge Support'] }
  ];

  constructor(private router: Router) {}

  selectPlan(id: any): void {
    console.log("🔍 Navigating to /pay/:id with ID:", id); // Debugging log
    this.router.navigate(['/pay', id]);  // Pass the plan id directly in the path
  }
}