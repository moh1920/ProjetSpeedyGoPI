import { KeycloakService } from '../../utils/keycloak/keycloak.service';
import { Component, OnInit, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  private http = inject(HttpClient);
  private keycloakService = inject(KeycloakService);
  private route = inject(ActivatedRoute);
  private router = inject(Router); // Inject Router

  stripe: Stripe | null = null;
  card: any;
  userEmail: string = '';
  selectedPlan: any = {};
  isProcessing: boolean = false;
  paymentStatus: string | null = null; // success or failed
  @ViewChild('cardElement') cardElement!: ElementRef;

  // Define available plans
  plans = [
    { id: 1, name: 'Basic', description: 'Essential Plan', price: 50, durationInDays: 30 },
    { id: 2, name: 'Standard', description: 'Popular Plan', price: 100, durationInDays: 60 },
    { id: 3, name: 'Premium', description: 'All-Inclusive Plan', price: 150, durationInDays: 90 },
    { id: 4, name: 'Ultimate', description: 'Exclusive Plan', price: 200, durationInDays: 120 }
  ];

  async ngOnInit() {
    this.userEmail = this.keycloakService?.userEmail || '';

    const planId = Number(this.route.snapshot.paramMap.get('id'));
    this.selectedPlan = this.plans.find(plan => plan.id === planId);

    if (!this.selectedPlan) {
      console.warn("⚠ Invalid plan ID, using default plan.");
      this.selectedPlan = this.plans[0];  // Default to the first plan
    }
    console.log('✅ Selected Plan:', this.selectedPlan);

    await this.initializeStripe();
  }

  async initializeStripe() {
    try {
      this.stripe = await loadStripe('pk_test_51Qvs9UKkZcbZ088UvOXeGZvmlZgtINj2BsB7Flr707fU99qquZhDGORvmX80hTd58zUkEbAvg7msl8CTGACswZRb006I1Dw1Wq');
      if (!this.stripe) {
        throw new Error("Stripe failed to initialize");
      }
    } catch (error) {
      console.error("Failed to initialize Stripe:", error);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mountCardElement();
    }, 100);
  }

  mountCardElement() {
    if (!this.stripe || !this.cardElement?.nativeElement) {
      console.error('Stripe or card element not available');
      return;
    }

    try {
      const elements = this.stripe.elements({
        fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }],
      });

      const style = {
        base: {
          fontFamily: 'Inter, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          color: '#0f172a',
          '::placeholder': {
            color: '#94a3b8',
          },
        },
        invalid: {
          color: '#ef4444',
          iconColor: '#ef4444',
        },
      };

      this.card = elements.create('card', { style });
      this.card.mount(this.cardElement.nativeElement);
    } catch (error) {
      console.error('Error mounting card element:', error);
    }
  }

  async pay() {
    if (this.isProcessing) return;

    if (!this.stripe || !this.card) {
      console.error('Stripe or Card element not initialized.');
      return;
    }

    try {
      this.isProcessing = true;

      const response: any = await this.http.post('http://localhost:8020/api/payment-intent', {
        email: this.userEmail,
        amount: this.selectedPlan.price * 100,  // Convert to cents
        planId: this.selectedPlan.id,  // Send the selected plan's id
      }).toPromise();

      if (!response || !response.client_secret) {
        throw new Error('Failed to retrieve client secret');
      }

      const { paymentIntent, error } = await this.stripe.confirmCardPayment(response.client_secret, {
        payment_method: {
          card: this.card,
          billing_details: { email: this.userEmail }
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        this.handleSuccessfulPayment(paymentIntent);
      } else {
        throw new Error(`Payment status: ${paymentIntent?.status || 'unknown'}`);
      }
    } catch (err: any) {
      console.error('Error processing payment:', err);
      this.showPaymentResult('failed', err.message || 'Unknown error');
    } finally {
      this.isProcessing = false;
    }
  }

  private handleSuccessfulPayment(paymentIntent: any) {
    this.showPaymentResult('success', 'Payment succeeded!');

    // Send the payment success and create subscription in the backend
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);
  }

  private showPaymentResult(status: string, message: string) {
    this.paymentStatus = status;
    this.paymentStatusMessage = message;

    setTimeout(() => {
      this.paymentStatus = null;
      this.paymentStatusMessage = '';
    }, 5000);
  }

  // Properties for displaying message
  paymentStatusMessage: string = '';
}
