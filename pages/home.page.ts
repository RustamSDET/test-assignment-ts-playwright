import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly loginBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.loginBtn = page.locator('#qa-header-cabinet-login');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickLogin() {
    await this.loginBtn.click();
  }
}