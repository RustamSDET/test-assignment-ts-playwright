import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { PaymentMethodComponent } from '../components/payment-method.component';

export class PaymentPage extends BasePage {
  public readonly form: PaymentMethodComponent;
  readonly urlPattern = /.*\/payment\/.*/;

  constructor(page: Page) {
    super(page);
    this.form = new PaymentMethodComponent(page);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.urlPattern);
  }

  async selectPaymentMethod(payment: {
    type: 'fiat' | 'crypto';
    name?: string;
    id?: string;
  }): Promise<string> {
    return await this.form.selectPaymentMethod(payment);
  }
}