import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Taxi } from 'src/app/services/models';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import {TaxiFormComponent} from "../taxi-form/taxi-form.component";
import {TaxiUpdateComponent} from "../taxi-update/taxi-update.component";
import {TaxiControllerService} from "../../services/services/taxi-controller.service";
import {TaxiStateService} from "../../services/services/taxi-state.service";


@Component({
  selector: 'app-taxi-list',
  imports: [CommonModule, NavbarComponent, TaxiFormComponent, TaxiUpdateComponent],
  templateUrl: './taxi-list.component.html',
  styleUrl: './taxi-list.component.scss',
  standalone: true,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-20px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({opacity: 0, transform: 'translateY(-20px)'}))
      ])
    ])
  ]

})
export class TaxiListComponent {
  standardTaxis: Taxi[] = [];
  premiumTaxis: Taxi[] = [];
  showStandardTaxis = false;
  showPremiumTaxis = false;
  private updateSubscription: Subscription;

  constructor(private taxiService: TaxiControllerService , private taxiStateService : TaxiStateService) {
    this.updateSubscription = this.taxiStateService.taxiUpdated$.subscribe(updatedTaxi => {
      this.updateTaxiInList(updatedTaxi);
    });
  }
  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.taxiService.getAllTaxis().subscribe(taxis => {
      taxis.forEach(taxi => {
        if (taxi.model?.toLowerCase() === 'other' && taxi.othermodel) {
          taxi.model = taxi.othermodel;
        }
      });
      this.standardTaxis = taxis.filter(taxi => taxi.typeTaxi === 'STANDARD');
      this.premiumTaxis = taxis.filter(taxi => taxi.typeTaxi === 'PREMIUM');
    });
  }

  toggleStandardTaxis(): void {
    this.showStandardTaxis = !this.showStandardTaxis;
  }

  togglePremiumTaxis(): void {
    this.showPremiumTaxis = !this.showPremiumTaxis;
  }

  // delete taxi :
   deleteTaxi(id?: number): void {
    if ((id !== undefined && id !== null) ) {
    this.taxiService.deleteTaxiById({ id }).subscribe(() => {
      console.log(`Taxi with ID ${id} has been successfully deleted.`);
      this.standardTaxis = this.standardTaxis.filter(taxi => taxi.id !== id);
      this.premiumTaxis = this.premiumTaxis.filter(taxi => taxi.id !== id);
    });
    }

}
scrollToForm() {
  const formSection = document.getElementById('taxiFormSection');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
}
private updateTaxiInList(updatedTaxi: any) {
  // Mettre à jour dans la liste standard
  if (updatedTaxi.typeTaxi === 'STANDARD') {
    const index = this.standardTaxis.findIndex(t => t.id === updatedTaxi.id);
    if (index !== -1) {
      this.standardTaxis[index] = updatedTaxi;
      this.standardTaxis = [...this.standardTaxis]; // Force refresh
    }
  }

  // Mettre à jour dans la liste premium
  if (updatedTaxi.typeTaxi === 'PREMIUM') {
    const index = this.premiumTaxis.findIndex(t => t.id === updatedTaxi.id);
    if (index !== -1) {
      this.premiumTaxis[index] = updatedTaxi;
      this.premiumTaxis = [...this.premiumTaxis]; // Force refresh
    }
  }

  // Gérer le changement de type
  if (updatedTaxi.typeTaxi === 'STANDARD') {
    const premiumIndex = this.premiumTaxis.findIndex(t => t.id === updatedTaxi.id);
    if (premiumIndex !== -1) {
      this.premiumTaxis.splice(premiumIndex, 1);
      this.standardTaxis.push(updatedTaxi);
      this.premiumTaxis = [...this.premiumTaxis];
      this.standardTaxis = [...this.standardTaxis];
    }
  } else if (updatedTaxi.typeTaxi === 'PREMIUM') {
    const standardIndex = this.standardTaxis.findIndex(t => t.id === updatedTaxi.id);
    if (standardIndex !== -1) {
      this.standardTaxis.splice(standardIndex, 1);
      this.premiumTaxis.push(updatedTaxi);
      this.standardTaxis = [...this.standardTaxis];
      this.premiumTaxis = [...this.premiumTaxis];
    }
  }
}



}
