import { test, expect } from '../fixtures/page-fixtures';
import { paymentMethodsRU } from '../data/payment-methods';
import * as allure from "allure-js-commons";

test.describe('RU Site: Subscription and Payment Matrix', () => {
  for (const payment of paymentMethodsRU) {
    
    test(`Should purchase 1 Year plan using ${payment.name} @purchase @ru`, async ({ page, subscriptionPage, paymentPage }) => {

      await allure.epic('Покупка подписки (RU)');
      await allure.feature(payment.type === 'crypto' ? 'Оплата криптовалютой' : 'Оплата банковскими картами / СБП');
      await allure.story(`Оплата тарифа "1 Год" через ${payment.name}`);
      await allure.owner('QA Automation Team');
      await allure.severity('critical');
      await allure.description(`Проверка полного цикла покупки персонального VPN на RU-сайте. Выбирается локация DE, валюта RUB, тариф "1 год", вводится email, выбирается метод "${payment.name}", проверяется корректность отправки POST-запроса на бэкенд и последующий редирект.`);
      await allure.link('https://planetconfig.com/', 'RU сайт покупки подписки');
      await allure.parameter('Способ оплаты', payment.name);
      await allure.parameter('Тип платежа', payment.type === 'crypto' ? 'Cryptocurrency' : 'Fiat');

      const uniqueEmail = `qa-auto-${Date.now()}@planetconfig.com`;

      await test.step('Открыть страницу подписки', async () => {
        await subscriptionPage.goto();
      });

      await test.step('Заполнить параметры подписки и отправить', async () => {
        await subscriptionPage.fillAndSubmit({
          location: 'DE',
          currency: 'RUB',
          plan: '1_year',
          email: uniqueEmail,
        });
      });

      await test.step('Дождаться загрузки страницы выбора оплаты', async () => {
        await paymentPage.waitForLoad();
      });

      let expectedGatewayId = '';
      await test.step(`Выбрать метод оплаты: "${payment.name}"`, async () => {
        expectedGatewayId = await paymentPage.selectPaymentMethod(payment);
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

      await test.step('Проверить отправленные в POST-запросе параметры', async () => {
        const params = new URLSearchParams(response.request().postData() || '');
        
        await test.step('Проверить корректность email', async () => {
          expect(
            params.get('email'), 
            '❌ Ошибка Payload: На бэкенд ушел некорректный email пользователя'
          ).toBe(uniqueEmail);
        });

        await test.step('Проверить ID выбранного шлюза', async () => {
          expect(
            params.get('gateway'), 
            `❌ Ошибка Payload: На бэкенд ушел не тот ID шлюза, который был выбран на UI (Ожидался: ${expectedGatewayId})`
          ).toBe(expectedGatewayId);
        });

        await test.step('Проверить ID оффера', async () => {
          expect(
            params.get('offer_id'), 
            '❌ Ошибка Payload: Неверный id оффера. Ожидался offer_id=1_year'
          ).toBe('1_year');
        });
      });

      await test.step('Дождаться редиректа на платежный шлюз или страницу ошибки', async () => {
        await page.waitForURL((url) => {
          const isInternalFailed = url.pathname.includes('/failed');
          const isExternalGateway = !url.hostname.includes('planetconfig.com') && 
                                    !url.hostname.includes('freevpnplanet.com');
          return isInternalFailed || isExternalGateway;
        }, { timeout: 30000, waitUntil: 'domcontentloaded' });
      });

      await test.step('Проверить финальный URL и корректность отображения страницы', async () => {
        const finalUrl = page.url();

        if (finalUrl.includes('/failed')) {
          test.info().annotations.push({ 
            type: 'Prod Anti-Fraud / Expected Issue', 
            description: `Бэкенд перенаправил на /failed из-за ограничений продового эквайринга для ${payment.name}.` 
          });
          await expect(page.locator('text="Транзакция отклонена"')).toBeVisible();
        } else {
          test.info().annotations.push({ 
            type: 'Payment Gateway Success', 
            description: `Успешный переход на платежный шлюз: ${finalUrl}` 
          });
        }
      });
      
    });
  }
});