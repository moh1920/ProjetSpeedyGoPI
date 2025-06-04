import {Component, OnInit} from '@angular/core';
import {SpinHistory, SpinHistoryWithUserDTO, SpinService, UserDTO} from "./services/spin.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../services/services/user.service";
import {NgxPaginationModule} from "ngx-pagination";
import {NavbarComponent} from "../navbar/navbar.component";
import {FooterComponent} from "../footer/footer.component";
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    NgxPaginationModule,
    NavbarComponent,
    FooterComponent,
    Button,
    Dialog,
    InputText,
    FormsModule
  ]
})
export class SpinComponent implements OnInit {
  canSpin = false;
  spinning = false;
  rewards: string[] = [];
  result: string | null = null;
  rotation = 0;
  loading: boolean = true;
  currentPage: number = 1;

  constructor(private spinService: SpinService,private userService:UserService,private toastService:ToastrService) {}

  ngOnInit(): void {
    this.loadSpinStatus();
    this.loadRewards();
    this.getSpinHistories();
  }

  loadSpinStatus(): void {
    if (this.isTuesday() && !this.hasSpunThisWeek()) {
      this.spinService.getStatus().subscribe(status => {
        this.canSpin = !status;
        console.log("you can spin:", this.canSpin);
      });
    } else {
      this.canSpin = false;
      console.log("You cannot spin today!");

      if (!this.isTuesday()) {
        this.toastService.info("The wheel can only be spun on Tuesdays!");
      } else if (this.hasSpunThisWeek()) {
        this.toastService.info("You've already spun the wheel this week!");
      }
    }
  }


  loadRewards(): void {
    this.spinService.getItems().subscribe(items => {
      this.rewards = items;
      console.log(this.rewards);

    });
  }

  pointerRotation:any;
  spin(): void {
    if (!this.canSpin || this.spinning || this.rewards.length === 0) return;

    this.spinning = true;
    this.result = null;

    this.spinService.spin().subscribe(reward => {
      const rewardIndex = this.rewards.indexOf(reward);
      const segmentAngle = 360 / this.rewards.length;
      const stopAngle = rewardIndex * segmentAngle;
      const randomTurns = 5 + Math.floor(Math.random() * 3); // 5 à 7 tours
      const totalRotation = randomTurns * 360 + stopAngle;

      this.rotation += totalRotation;
      this.pointerRotation = -90 + stopAngle;

      setTimeout(() => {
        this.result = reward;
        this.spinning = false;
        this.canSpin = false;

        localStorage.setItem('lastSpinDate', new Date().toString());
      }, 4000);
    });
    this.getSpinHistories();
  }

  isTuesday(): boolean {
    const today = new Date();
    return today.getDay() === 2;
  }

  hasSpunThisWeek(): boolean {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    if (!lastSpinDate) {
      return false;
    }

    const lastSpin = new Date(lastSpinDate);

    const today = new Date();
    const sameWeek = lastSpin.getFullYear() === today.getFullYear() &&
      this.getWeekNumber(lastSpin) === this.getWeekNumber(today);

    return sameWeek;
  }

  getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startDate.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.ceil((dayOfYear + 1) / 7);
  }

  spinHistories: SpinHistoryWithUserDTO[] = [];

  getSpinHistories(): void {
    this.spinService.getSpinHistoriesThisWeek().subscribe({
      next: (data) => {
        this.spinHistories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching spin histories:', err);
        this.loading = false;
      }
    });
  }

  itemsPerPage = 2;
  get paginatedPV() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.spinHistories.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.spinHistories.length / this.itemsPerPage);
  }


  rewardName: string = '';

  addRewards() {
    this.spinService.saveReward(this.rewardName).subscribe({
      next: () => {
        this.visible = false;
        this.loadRewards();
        this.rewardName = '';
      },
      error: err => {
        console.error('Error saving reward:', err);
      }
    });
  }


  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
