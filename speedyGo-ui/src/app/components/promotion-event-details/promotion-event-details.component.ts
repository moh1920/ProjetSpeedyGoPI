import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PromotionAndEventService} from "../../services/services/promotion-and-event.service";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {Image} from "primeng/image";
import {PostService} from "../../services/services/post.service";

@Component({
  selector: 'app-promotion-event-details',
  imports: [
    NgIf,
    DatePipe,
    NgClass,
    Image
  ],
  templateUrl: './promotion-event-details.component.html',
  standalone: true,
  styleUrl: './promotion-event-details.component.scss'
})
export class PromotionEventDetailsComponent implements OnInit {

  pv: any = null;
  loading: boolean = true;
  error: string | null = null;
  imageUrls: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pvService: PromotionAndEventService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    console.log('PromotionEventDetailsComponent initialized');
    const pvId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Promotion ID from route:', pvId);
    this.loadPvDetails(pvId);
  }

  private loadPvDetails(pvId: number) {
    this.loading = true;
    this.pvService.getPromotionById({'pvId': pvId}).subscribe({
      next: (pv) => {
        this.pv = pv;
        if (pv.imageUrl) {
          this.postService.getImage(pv.imageUrl).subscribe(
            (imageBlob) => {
              console.log('Image blob:', imageBlob);
              const imageUrl = URL.createObjectURL(imageBlob);
              this.imageUrls = imageUrl;
            },
            (error) => {
              console.error('Error fetching image:', error);
            }
          );
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading promotion details';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  // Method to handle retry loading
  retryLoading(): void {
    this.error = null;
    const pvId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPvDetails(pvId);
  }

  // Calculate days left until end date
  calculateDaysLeft(): number {
    if (!this.pv || !this.pv.endDate) return 0;

    const endDate = new Date(this.pv.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  // Calculate days until start date
  calculateDaysUntilStart(): number {
    if (!this.pv || !this.pv.startDate) return 0;

    const startDate = new Date(this.pv.startDate);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  // Calculate total duration of the promotion/event in days
  calculateDuration(): number {
    if (!this.pv || !this.pv.startDate || !this.pv.endDate) return 0;

    const startDate = new Date(this.pv.startDate);
    const endDate = new Date(this.pv.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  onEdit(): void {
    this.router.navigate(['/pv/edit', this.pv.id]);
  }

  onBack(): void {
    this.router.navigate(['/pv']);
  }
}
