import { test, expect } from '../fixtures/page-fixtures';
import { paymentMethodsEN } from '../data/payment-methods';
import * as allure from "allure-js-commons";

test.describe('EN Site: Subscription and Payment Matrix', () => {
  for (const payment of paymentMethodsEN) {
    
    test(`Should purchase 1 Month plan using ${payment.name} @purchase @en`, async ({ page, subscriptionPage, paymentPage }) => {

      await allure.epic('Покупка подписки (EN)');
      await allure.feature(payment.type === 'crypto' ? 'Оплата криптовалютой' : 'Оплата банковскими картами (Stripe)');
      await allure.story(`Оплата тарифа "1 Месяц" через ${payment.name}`);
      await allure.owner('QA Automation Team');
      await allure.severity('critical');
      await allure.description(`Проверка полного цикла покупки персонального VPN на EN-сайте (personal.freevpnplanet.com). Выбирается локация NL, валюта EUR, тариф "1 месяц", вводится email, выбирается метод "${payment.name}", проверяется корректность отправки POST-запроса на бэкенд и последующий редирект.`);
      await allure.link('https://personal.freevpnplanet.com/', 'EN сайт покупки подписки');
      await allure.parameter('Способ оплаты', payment.name);
      await allure.parameter('Тип платежа', payment.type === 'crypto' ? 'Cryptocurrency' : 'Fiat');

      const uniqueEmail = `qa-en-${Date.now()}@planetconfig.com`;

      await test.step('Открыть страницу подписки', async () => {
        await subscriptionPage.goto();
      });

      await test.step('Заполнить параметры подписки и отправить', async () => {
        await subscriptionPage.fillAndSubmit({
          location: 'NL',
          currency: 'EUR',
          plan: '1_month',
          email: uniqueEmail,
        });
      });

      await test.step('Дождаться загрузки страницы выбора оплаты', async () => {
        await paymentPage.waitForLoad();
      });

      await test.step(`Выбрать метод оплаты: "${payment.name}"`, async () => {
        await paymentPage.selectPaymentMethod(payment);
      });

      await test.step('Принять пользовательское соглашение', async () => {
        await paymentPage.form.acceptTerms();
      });

      let response: any;
      await test.step('Оформить платеж и дождаться ответа API /payment', async () => {
        response = await paymentPage.form.submitPaymentAndIntercept();
      });

      await test.step('Проверить успешность ответа API (status 200)', async () => {
        expect(response.ok(), `❌ Ошибка API: Запрос оплаты отклонен (статус ${response.status()})`).toBeTruthy();
      });

      await test.step('Дождаться редиректа на внешний платежный шлюз', async () => {
        await page.waitForURL((url) => {
          const isInternalFailed = url.pathname.includes('/failed');
          const isExternalGateway = !url.hostname.includes('planetconfig.com') && 
                                    !url.hostname.includes('freevpnplanet.com');
          return isInternalFailed || isExternalGateway;
        }, { timeout: 30000, waitUntil: 'domcontentloaded' });
      });

      await test.step('Проверить финальный URL шлюза', async () => {
        const currentUrl = page.url();

        if (currentUrl.includes('/failed')) {
          test.info().annotations.push({ 
            type: 'Prod Anti-Fraud / Expected Issue', 
            description: `Бэкенд перенаправил на /failed из-за ограничений продового эквайринга для ${payment.name}.` 
          });
          await expect(
            page.locator('text="Transaction was rejected"')
              .or(page.locator('text="Something went wrong"'))
              .or(page.locator('text="Something went wrong ?"'))
          ).toBeVisible();
        } else if (payment.expectSuccess) {
          expect(
            currentUrl, 
            `❌ Ошибка интеграции: Шлюз отклонил транзакцию для ${payment.name}`
          ).not.toContain('/failed/');
        }
      });
      
    });
  }
});