import { test as base } from '@playwright/test';

import { BasePage } from '../pages/base.page';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { OrderPage } from '../pages/order.page';
import { SubscriptionPage } from '../pages/subscription.page';
import { PaymentPage } from '../pages/payment.page';

type MyFixtures = {
  basePage: BasePage;
  homePage: HomePage;
  loginPage: LoginPage;
  orderPage: OrderPage;
  subscriptionPage: SubscriptionPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<MyFixtures>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  orderPage: async ({ page }, use) => {
    await use(new OrderPage(page));
  },
  subscriptionPage: async ({ page }, use) => {
    await use(new SubscriptionPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
});

export { expect } from '@playwright/test';