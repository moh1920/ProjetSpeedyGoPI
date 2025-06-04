import { Component } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem, NgxPayPalModule } from 'ngx-paypal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paypal-pay',
  imports: [CommonModule, NgxPayPalModule],
  templateUrl: './paypal-pay.component.html',
  standalone: true,
  styleUrls: ['./paypal-pay.component.scss']
})

export class PaypalPayComponent {
  public payPalConfig?: IPayPalConfig;
  public errorMessage: string = ''; // This will store the error message
  purchaseItems = [
    { name: 'Waterproof Mobile Phone', quantity: 2, price: 450 },
    { name: 'Smartphone Dual Camera', quantity: 3, price: 240 },
    { name: 'Black Colour Smartphone', quantity: 1, price: 950 }
  ]
  total!: string;

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.total = this.purchaseItems.map(x => x.quantity * x.price).reduce((a, b) => a + b, 0).toString();
    const currency = 'USD';

    this.payPalConfig = {
      currency: currency,
      clientId: 'AaYLERidmKyvmPCLhNL3dQXjLXbTVezzVQGKOpsh3nYb2lXm8ivpVMiDpvu1I6TO6T0uukGe1ZV98dJ0',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: this.total,
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: this.total
                }
              }
            },
            items: this.purchaseItems.map(x => <ITransactionItem> {
              name: x.name,
              quantity: x.quantity.toString(),
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: currency,
                value: x.price.toString(),
              },
            })
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.error('OnError', err);
        this.errorMessage = 'An error occurred during the payment process. Please try again later.';
        alert('An error occurred during the payment process. Please try again later.');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}

