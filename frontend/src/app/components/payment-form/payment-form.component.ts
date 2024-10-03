import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  standalone: true, // Declare as a standalone component
  imports: [FormsModule] // Import FormsModule here
})
export class PaymentFormComponent {
  paymentForm = {
    amount: null,
    currency: '',
    provider: '',
    accountInfo: '',
    swiftCode: ''
  };

  constructor(private http: HttpClient) { }

  onSubmit() {
    this.http.post('/api/payment/process', this.paymentForm)
      .subscribe(
        response => console.log('Payment successful', response),
        error => console.error('Error processing payment', error)
      );
  }
}
