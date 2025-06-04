import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {DataView} from "primeng/dataview";
import {Select} from "primeng/select";
import {Panel} from "primeng/panel";
import {Card} from "primeng/card";
import {PrimeTemplate} from "primeng/api";
import {PromotionAndEventService} from "../../services/services/promotion-and-event.service";
import {EventPromotion} from "../../services/models/event-promotion";
import {ScrollPanel} from "primeng/scrollpanel";
import {DatePipe, NgIf} from "@angular/common";
import {Drawer} from "primeng/drawer";
import {PostService} from "../../services/services/post.service";

@Component({
  selector: 'app-ads-list',
  imports: [
    Button,
    DataView,
    Select,
    Panel,
    Card,
    PrimeTemplate,
    ScrollPanel,
    DatePipe,
    Drawer,
    NgIf
  ],
  templateUrl: './ads-list.component.html',
  standalone: true,
  styleUrl: './ads-list.component.scss'
})
export class AdsListComponent implements OnInit,AfterViewInit,OnDestroy{


 /* adverts: EventPromotion[] = [];

  constructor(private advertService: PromotionAndEventService) {
  }
  @ViewChild('adsContainer', { static: false }) adsContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  scrollLeft() {
    if (this.adsContainer?.nativeElement) {
      this.adsContainer.nativeElement.scrollLeft -= 300; // Défilement vers la gauche
    }
  }

  scrollRight() {
    if (this.adsContainer?.nativeElement) {
      this.adsContainer.nativeElement.scrollLeft += 300; // Défilement vers la droite
    }
  }

  startAutoScroll() {
    if (!this.adsContainer?.nativeElement) return;

    let scrollAmount = 0;
    const speed = 2;
    const step = 1;
    const adsContainer = this.adsContainer.nativeElement;

    function scroll() {
      if (!adsContainer) return;
      if (scrollAmount < adsContainer.scrollWidth - adsContainer.clientWidth) {
        scrollAmount += step;
      } else {
        scrollAmount = 0;
      }
      adsContainer.scrollLeft = scrollAmount;
      requestAnimationFrame(scroll);
    }

    scroll();
  }
  getAdverts() {
    this.advertService.getAllPromotions()
      .subscribe({
        next:(data)=>{
          this.adverts=data;
        }
      })

  }

  ngOnInit(): void {
    this.getAdverts();
  }

  isSidebarVisible: boolean = true;
  visible: boolean=true;

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (this.isSidebarVisible) {
      sidebar?.classList.add('inactive');
      sidebar?.classList.remove('active');
    } else {
      sidebar?.classList.add('active');
      sidebar?.classList.remove('inactive');
    }
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  adverts = [
    { id: 1, typeEV_ep: 'Promotion', description: 'Promo de la Saint-Valentin', status: 'ACTIVE', startDate: '2025-02-13', endDate: '2025-02-14', imageUrl: 'assets/valentines-promo.jpg' },
    { id: 2, typeEV_ep: 'Event', description: 'Soirée spéciale', status: 'ACTIVE', startDate: '2025-02-15', endDate: '2025-02-16', imageUrl: 'assets/valentines-promo.jpg' },
    // Ajoutez d'autres promotions/événements ici
  ];*/

  adverts: EventPromotion[] = [];
  currentAdvertIndex = 0;
  currentAdvert: EventPromotion | null = null; // Initialisé à null
  advertInterval: any;
  loading: boolean = true; // Par défaut on commence avec loading true
  imageUrls: string[] = [];

  constructor(private pvService: PromotionAndEventService, private postService: PostService) {}

  getAllPVData() {
    this.loading = true; // S'assurer que loading est à true pendant le chargement

    this.pvService.getAllPromotions().subscribe({
      next: (data) => {
        this.adverts = data;

        // Si pas de publicités, désactiver le chargement
        if (this.adverts.length === 0) {
          this.loading = false;
          return;
        }

        // Compteur pour suivre le chargement des images
        let loadedImagesCount = 0;

        this.adverts.forEach((advert, index) => {
          this.postService.getImage(advert.imageUrl!).subscribe(
            (imageBlob) => {
              console.log('Image blob:', imageBlob);
              const imageUrl = URL.createObjectURL(imageBlob);
              this.imageUrls[index] = imageUrl; // Assigner à l'index spécifique

              loadedImagesCount++;

              // Quand toutes les images sont chargées
              if (loadedImagesCount === this.adverts.length) {
                this.currentAdvert = this.adverts[0];
                this.loading = false; // Désactiver le chargement
              }
            },
            (error) => {
              console.error('Error fetching image:', error);
              loadedImagesCount++;

              // Même en cas d'erreur, on vérifie si c'est la dernière image
              if (loadedImagesCount === this.adverts.length) {
                this.currentAdvert = this.adverts[0];
                this.loading = false; // Désactiver le chargement
              }
            }
          );
        });
      },
      error: (err) => {
        console.error('Error fetching promotions:', err);
        this.loading = false; // Désactiver le chargement en cas d'erreur
      }
    });
  }

  ngOnInit(): void {
    this.getAllPVData();
  }

  ngOnDestroy(): void {
    if (this.advertInterval) {
      clearInterval(this.advertInterval);
    }

    // Nettoyer les URL des objets pour éviter les fuites de mémoire
    this.imageUrls.forEach(url => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
  }

  startAutoChange() {
    // Ne démarrer le carousel que si nous avons des publicités
    if (this.adverts.length > 0) {
      this.advertInterval = setInterval(() => {
        this.nextAdvert();
      }, 5000); // Change toutes les 5 secondes
    }
  }

  nextAdvert() {
    if (this.adverts.length > 0) {
      this.currentAdvertIndex = (this.currentAdvertIndex + 1) % this.adverts.length;
      this.currentAdvert = this.adverts[this.currentAdvertIndex];
    }
  }

  prevAdvert() {
    if (this.adverts.length > 0) {
      this.currentAdvertIndex = (this.currentAdvertIndex - 1 + this.adverts.length) % this.adverts.length;
      this.currentAdvert = this.adverts[this.currentAdvertIndex];
    }
  }

  ngAfterViewInit(): void {
    if (!this.advertInterval && !this.loading && this.adverts.length > 0) {
      this.startAutoChange();
    }
  }

}
