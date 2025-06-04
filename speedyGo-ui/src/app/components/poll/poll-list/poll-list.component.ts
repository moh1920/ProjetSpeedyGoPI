import { Component, OnInit } from '@angular/core';
import { Poll, PollService } from "../poll.service";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {NavbarComponent} from "../../navbar/navbar.component";
import {FooterComponent} from "../../footer/footer.component";

export interface PollResponseRequest {
  pollId: number;
  selectedOptionIds: number[];
}



@Component({
  selector: 'app-poll-list',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './poll-list.component.html',
  standalone: true,
  styleUrl: './poll-list.component.scss'
})
export class PollListComponent implements OnInit {

  activePolls: Poll[] = [];
  selectedOptionIds: { [pollId: number]: number } = {};
  pollVoted: { [pollId: number]: boolean } = {};

  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit(): void {
    this.getActivePolls();
  }

  getActivePolls(): void {
    this.pollService.getActivePolls().subscribe((polls: Poll[]) => {
      this.activePolls = polls;
    });
  }

  vote(pollId: number): void {
    if (!this.selectedOptionIds[pollId]) {
      return;
    }

    const selected = this.selectedOptionIds[pollId];
    const request: PollResponseRequest = {
      pollId: pollId,
      selectedOptionIds: Array.isArray(selected) ? selected : [selected]
    };


    this.pollService.submitPollResponse(request).subscribe(
      response => {

        this.pollVoted[pollId] = true;
        this.getActivePolls();

      },
      error => {
        console.error('Erreur lors du vote:', error);
        // Gérer l'erreur - afficher un message à l'utilisateur
      }
    );
  }

  addPoll() {
    this.router.navigate(['/create-poll']);
  }

  viewResult(id: number) {
    this.router.navigate(['/poll-result/' + id]);
  }

  // Méthode pour valider si un sondage a été voté
  hasPollBeenVoted(pollId: number): boolean {
    return this.pollVoted[pollId] === true;
  }

  currentPage: number = 1;
  itemsPerPage: number = 6;

  get paginatedPolls() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.activePolls.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.activePolls.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

}
