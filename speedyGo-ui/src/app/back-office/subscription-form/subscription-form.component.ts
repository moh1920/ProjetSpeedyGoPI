import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionControllerService } from '../../services/services/subscription-controller.service';
import { Subscription } from '../../services/models/subscription';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SubscriptionPack {
  label: string;
  planName: string;
  price: number;
  durationInDays: number;
}

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss']
})
export class SubscriptionFormComponent implements OnInit, OnChanges {
  // When editing, the parent provides a subscription object.
  @Input() subscription: Subscription | null = null;
  @Output() formSubmitted = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();

  subscriptionForm: FormGroup;

  // Define three static packs.
  packs: SubscriptionPack[] = [
    { label: 'Basic Pack', planName: 'Basic Pack', price: 19.99, durationInDays: 30 },
    { label: 'Standard Pack', planName: 'Standard Pack', price: 39.99, durationInDays: 60 },
    { label: 'Premium Pack', planName: 'Premium Pack', price: 59.99, durationInDays: 90 },
    { label: ' Ultimate pack', planName: 'Premium Pack', price: 99.99, durationInDays: 120 }
  ];

  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subscription'] && this.subscription) {
      // Patch the form with existing values including the subscriber's email.
      this.subscriptionForm.patchValue({
        id: this.subscription.id,
        subscriberEmail: this.subscription.subscriber ? this.subscription.subscriber.email : '',
        planName: this.subscription.planName,
        price: this.subscription.price,
        durationInDays: this.subscription.durationInDays,
        isActive: this.subscription.isActive
      });
    } else if (!this.subscription) {
      // Reset the form for add mode
      this.subscriptionForm.reset({
        subscriberEmail: '',
        planName: '',
        price: null,
        durationInDays: null,
        isActive: false,
        packSelection: null
      });
    }
  }

  buildForm(): void {
    this.subscriptionForm = this.fb.group({
      id: [null],
      subscriberEmail: ['', [Validators.required, Validators.email]],
      planName: ['', Validators.required],
      price: [null, Validators.required],
      durationInDays: [null, Validators.required],
      isActive: [false, Validators.required],
      packSelection: [null]
    });
  }

  patchForm(): void {
    this.subscriptionForm.patchValue({
      id: this.subscription?.id,
      subscriberEmail: this.subscription?.subscriber ? this.subscription.subscriber.email : '',
      planName: this.subscription?.planName,
      price: this.subscription?.price,
      durationInDays: this.subscription?.durationInDays,
      isActive: this.subscription?.isActive,
      packSelection: null // Do not preselect a pack when editing.
    });
  }

  // When a pack is selected, update the relevant form controls.
  onPackSelected(pack: SubscriptionPack): void {
    this.subscriptionForm.patchValue({
      planName: pack.planName,
      price: pack.price,
      durationInDays: pack.durationInDays
    });
  }

  onSubmit(): void {
    if (this.subscriptionForm.invalid) {
      return;
    }
    const formValue = this.subscriptionForm.value;
  
    if (formValue.id) {
      // Update existing subscription.
      this.subscriptionService.updateSubscription({ id: formValue.id, body: formValue }).subscribe({
        next: (res) => {
          console.log('Subscription updated:', res);
          this.formSubmitted.emit(true);
          this.subscriptionForm.reset();
          this.router.navigate(['/subscripion-managments']);
        },
        error: (err) => {
          console.error('Error updating subscription:', err);
          // Handle specific error for non-existing user email
          if (err.status === 400 && err.error.includes('No user found with email')) {
            this.errorMessage = 'The email does not exist.';  // Set error message
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      });
    } else {
      // Create new subscription. The subscriber email is sent as a query parameter.
      this.subscriptionService.createSubscription({ email: formValue.subscriberEmail, body: formValue }).subscribe({
        next: (res) => {
          console.log('Subscription created:', res);
          this.formSubmitted.emit(true);
          this.subscriptionForm.reset();
          this.router.navigate(['/subscripion-managments']);
        },
        error: (err) => {
          console.error('Error creating subscription:', err);
          // Handle specific error for non-existing user email
          if (err.status === 400 && err.error.includes('No user found with email')) {
            this.errorMessage = 'The email does not exist.';  // Set error message
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      });
    }
  }
  
  // Show error message to the user (this can be a modal or alert)
  showErrorMessage(message: string): void {
    this.errorMessage = message;  // Set error message to be displayed in the HTML
  }

  onCancel(): void {
    this.cancel.emit();
    this.subscriptionForm.reset();
    this.router.navigate(['/subscripion-managments']);
  }

  // Method to check if a form control has an error
  shouldShowError(controlName: string): boolean {
    const control = this.subscriptionForm.get(controlName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  // Method to get error message for form control
  getErrorMessage(controlName: string): string {
    const control = this.subscriptionForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    return 'Invalid value';
  }
}
