import { Component, OnInit } from '@angular/core';
import {PollService} from "../poll.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FooterComponent} from "../../footer/footer.component";
import {FormsModule} from "@angular/forms";
import {NavbarComponent} from "../../navbar/navbar.component";
import {Router} from "@angular/router";

export interface Poll {
  id: number;
  question: string;
  options: any[];
  active: boolean;
}

interface PollCreateRequest {
  poll: {
    question: string;
  };
  options: string[]; // Explicitly define options as string array
}

@Component({
  selector: 'app-poll-create',
  templateUrl: './poll-create.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FooterComponent,
    FormsModule,
    NavbarComponent,
    NgForOf
  ],
  styleUrls: ['./poll-create.component.scss']
})
export class PollCreateComponent implements OnInit {
  pollCreateRequest: PollCreateRequest = {
    poll: {
      question: ''
    },
    options: [] as string[] // Explicitly cast as string array
  };

  newOption: string = '';

  // Existing properties from your code
  activePolls: Poll[] = [];

  // New properties for top questions section
  topPolls: Poll[] = [];
  loadingTopPolls: boolean = true;

  constructor(private pollService: PollService,private router:Router) {}

  ngOnInit() {
    this.getActivePolls();
    this.getTopPolls();
  }

  // Existing method from your code
  getActivePolls(): void {
    this.pollService.getActivePolls().subscribe((polls: Poll[]) => {
      this.activePolls = polls;
    });
  }

  // New methods for top questions functionality
  getTopPolls(): void {
    this.loadingTopPolls = true;
    this.pollService.getActivePolls().subscribe((polls: Poll[]) => {
      // Sort polls by vote count (highest first)
      this.topPolls = this.sortPollsByVotes(polls).slice(0, 4); // Get top 10
      this.loadingTopPolls = false;
    }, error => {
      console.error('Error loading top polls', error);
      this.loadingTopPolls = false;
    });
  }

  sortPollsByVotes(polls: Poll[]): Poll[] {
    return [...polls].sort((a, b) => {
      const votesA = this.calculateVoteCount(a);
      const votesB = this.calculateVoteCount(b);
      return votesB - votesA;
    });
  }

  calculateVoteCount(poll: Poll): number {
    // This calculation depends on how votes are stored in your options
    // Here's an example assuming each option has a 'votes' property
    let totalVotes = 0;
    if (poll.options && Array.isArray(poll.options)) {
      poll.options.forEach(option => {
        if (option.votes) {
          totalVotes += option.votes;
        }
      });
    }
    return totalVotes;
  }

  useQuestion(questionText: string): void {
    this.pollCreateRequest.poll.question = questionText;
    // Focus on the question field
    document.getElementById('question')?.focus();
    // Scroll to the top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addOption(): void {
    if (this.newOption.trim()) {
      this.pollCreateRequest.options.push(this.newOption.trim());
      this.newOption = '';
    }
  }

  removeOption(index: number): void {
    this.pollCreateRequest.options.splice(index, 1);
  }

  createPoll(): void {
    // Your existing createPoll implementation
    if (this.pollCreateRequest.poll.question && this.pollCreateRequest.options.length > 0) {
      this.pollService.createPoll(this.pollCreateRequest).subscribe(
        response => {
          this.router.navigate(['/poll-list']);
          // Handle successful creation
          console.log('Poll created successfully', response);
          // Reset form
          this.pollCreateRequest = { poll: { question: '' }, options: [] as string[] };
          // Refresh active polls
          this.getActivePolls();
        },
        error => {
          console.error('Error creating poll', error);
        }
      );
    }
  }
}
