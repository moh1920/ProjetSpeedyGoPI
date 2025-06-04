import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../store.service";
import {StoreTemplateComponent} from "../store-template/store-template.component";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-store-page',
  imports: [
    StoreTemplateComponent,
    NgIf,
    NgStyle
  ],
  standalone:true,
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.scss'
})
export class StorePageComponent implements OnInit {
  storeData: any;
  storeId!:number;

  constructor(private storeService: StoreService, private route: ActivatedRoute) {}

  ngOnInit() {
     this.storeId = +this.route.snapshot.paramMap.get('id') !;
    console.log('🛠️ ID du store récupéré depuis l’URL:', this.storeId);

    if (this.storeId) {
      this.storeService.getStoreById(this.storeId).subscribe({
        next: (data) => {
          console.log('✅ Données du store récupérées:', data);
          this.storeData = data;
        },
        error: (err) => {
          console.error('❌ Erreur lors de la récupération du store:', err);
        }
      });
    } else {
      console.error('❌ storeId est undefined ! Vérifiez votre URL.');
    }
  }
}
