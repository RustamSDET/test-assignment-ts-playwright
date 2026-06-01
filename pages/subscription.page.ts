import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SubscriptionFormComponent } from '../components/subscription-form.component';
import { PaymentMethodComponent } from '../components/payment-method.component';

export class SubscriptionPage extends BasePage {
  public readonly subscriptionForm: SubscriptionFormComponent;
  public readonly paymentForm: PaymentMethodComponent;

  constructor(page: Page) {
    super(page);
    this.subscriptionForm = new SubscriptionFormComponent(page);
    this.paymentForm = new PaymentMethodComponent(page);
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async fillAndSubmit(options: {
    location: string;
    currency: string;
    plan: '2_days' | '1_month' | '1_year';
    email: string;
  }) {
    await this.subscriptionForm.selectLocation(options.location);
    await this.subscriptionForm.selectCurrency(options.currency);
    await this.subscriptionForm.selectPlan(options.plan);
    await this.subscriptionForm.fillEmail(options.email);
    await this.subscriptionForm.submit();
  }
}
