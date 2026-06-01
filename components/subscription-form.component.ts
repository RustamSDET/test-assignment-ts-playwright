import { Page, Locator } from '@playwright/test';

export class SubscriptionFormComponent {
  readonly page: Page;
  
  readonly locationDropdown: Locator;
  readonly currencyDropdown: Locator;
  readonly emailInput: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.locationDropdown = page.locator('label[data-name="location"]');
    this.currencyDropdown = page.locator('label[data-name="currency_code"]');
    this.emailInput = page.locator('input[name="email"]');
    this.submitBtn = page.locator('button[data-step="1"]');
  }

  async selectLocation(countryCode: string) {
    await this.locationDropdown.click();
    await this.locationDropdown.locator(`li[data-id="${countryCode}"]`).click({ delay: 100 });
  }

  async selectCurrency(currencyCode: string) {
    await this.currencyDropdown.click();
    await this.currencyDropdown.locator(`li[data-id="${currencyCode}"]`).click({ delay: 100 });
  }

  async selectPlan(planValue: '2_days' | '1_month' | '1_year') {
    await this.page.locator(`label:has(input[name="offer_id"][value="${planValue}"])`).click();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
    await this.emailInput.press('Tab'); 
  }

  async submit() {
    await this.submitBtn.click();
  }
}