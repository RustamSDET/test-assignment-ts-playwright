import { Page, Locator, Response } from '@playwright/test';
import { BasePage } from './base.page';

export class OrderPage extends BasePage {
  readonly emailInput: Locator;
  readonly nextButton: Locator;
  readonly creditCardMethod: Locator;
  readonly cryptoMethod: Locator;
  readonly submitBtn: Locator;

  readonly orderApiEndpoint = 'spacecom.cc/v4/orders';
  readonly stripeApiEndpoint = 'spacecom.cc/v4/checkout/stripe';

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('order-email-input');
    this.nextButton = page.getByTestId('order-login-submit-button');
    this.creditCardMethod = page.getByTestId('order-payment-method-world');
    this.cryptoMethod = page.getByTestId('order-payment-method-crypto-current');
    this.submitBtn = page.getByTestId('order-payment-submit-button');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async selectCreditCard() {
    await this.creditCardMethod.click();
  }

  async submitOrderAndIntercept(): Promise<[Response, Response]> {
    const [orderResponse, stripeResponse] = await Promise.all([
      this.page.waitForResponse(response => 
        response.url().includes(this.orderApiEndpoint) && 
        response.status() === 201
      ),
      this.page.waitForResponse(response => 
        response.url().includes(this.stripeApiEndpoint) && 
        response.request().method() === 'POST' &&
        response.status() === 200
      ),
      this.submitBtn.click()
    ]);

    return [orderResponse, stripeResponse];
  }
}