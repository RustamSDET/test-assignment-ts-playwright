import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly signUpTab: Locator;

  constructor(page: Page) {
    super(page);
    this.signUpTab = page.getByTestId('login-signup-link');
  }

  async switchToSignUp() {
    await this.signUpTab.click();
  }
}