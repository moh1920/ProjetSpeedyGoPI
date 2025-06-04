import { Component } from '@angular/core';
import {PollResults, PollService} from "../poll.service";
import {ActivatedRoute, Router} from "@angular/router";
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-poll-results',
  imports: [
    NgIf,
    NgForOf,
    KeyValuePipe,
    NgClass
  ],
  templateUrl: './poll-results.component.html',
  standalone: true,
  styleUrl: './poll-results.component.scss'
})
export class PollResultsComponent {

  pollId: number;
  results: PollResults = {};

  constructor(
    private pollService: PollService,
    private route: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.pollId = Number(this.route.snapshot.paramMap.get('pollId'));
    this.getPollResults();
  }

  getPollResults(): void {
    this.pollService.getPollResults(this.pollId).subscribe((results: PollResults) => {
      this.results = results;
    });
  }

  // Dans votre composant
  getTotalVotes(): number {
    let total = 0;
    for (const key in this.results) {
      if (this.results.hasOwnProperty(key)) {
        total += this.results[key];
      }
    }
    return total;
  }

  calculatePercentage(votes: number): number {
    const total = this.getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  }

  getProgressBarColor(index: number): string {
    // Rotation de couleurs pour les barres de progression
    const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger'];
    return colors[index % colors.length];
  }

  back(): void {
    this.router.navigate(['/poll-list'])
  }

  share(): void {
    // Méthode pour partager les résultats
    // Implémentez selon vos besoins
  }
}
