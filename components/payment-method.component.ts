import { Page, Locator, Response, expect } from '@playwright/test';

export class PaymentMethodComponent {
  readonly page: Page;
  readonly cryptoDropdownBtn: Locator;
  readonly termsInput: Locator;
  readonly termsLabel: Locator;
  readonly submitBtn: Locator;
  
  readonly apiEndpoint = '/payment';

  constructor(page: Page) {
    this.page = page;
    this.cryptoDropdownBtn = page.locator('.js-select-payment-btn');
    this.termsInput = page.locator('input[name="terms"]');
    this.termsLabel = page.locator('label:has(input[name="terms"])');
    this.submitBtn = page.locator('button[data-step="2"]');
  }

  async selectPaymentMethod(payment: {
    type: 'fiat' | 'crypto';
    name?: string;
    id?: string;
  }): Promise<string> {
    if (payment.type === 'crypto') {
      await this.cryptoDropdownBtn.click();
      const cryptoItem = this.page.locator(`.js-payment-item[data-id="${payment.id}"]`);
      await cryptoItem.click({ delay: 100 });
      
      const dropdown = this.page.locator('.js-select-payment-dropdown');
      await expect(dropdown).not.toHaveClass(/.*active.*/);
      return payment.id!;
    } else {
      const gatewayLabel = this.page.locator('label', { hasText: payment.name });
      const gatewayInput = gatewayLabel.locator('input[name="gateway"]');
      await gatewayInput.waitFor({ state: 'attached' });
      const gatewayValue = await gatewayInput.getAttribute('value') || '';
      await gatewayLabel.click();
      return gatewayValue;
    }
  }

  async acceptTerms() {
    const isChecked = await this.termsInput.isChecked();
    if (!isChecked) {
      await this.termsLabel.click();
    }
    await expect(this.termsInput, '❌ Чекбокс соглашения не перешел в состояние checked').toBeChecked();
  }

  async submitPaymentAndIntercept(): Promise<Response> {
    const [paymentResponse] = await Promise.all([
      this.page.waitForResponse(response => 
        response.url().includes(this.apiEndpoint) && 
        response.request().method() === 'POST'
      ),
      this.submitBtn.click()
    ]);
    
    return paymentResponse;
  }
}