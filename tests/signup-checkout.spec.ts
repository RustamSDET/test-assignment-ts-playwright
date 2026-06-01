import { test, expect } from '../fixtures/page-fixtures';
import * as allure from "allure-js-commons";

test.describe('Sign Up with Subscription', () => {

  test('User should be redirected to payment gateway after Sign Up @critical @signup', async ({ 
    page, 
    homePage, 
    loginPage, 
    orderPage 
  }) => {

    await allure.epic('Регистрация и Оплата');
    await allure.story('Регистрация нового пользователя с автоматическим переходом на оплату');
    await allure.owner('QA Automation Team');
    await allure.severity('critical');
    await allure.description('Проверка полного цикла: переход с главного сайта на страницу входа, затем на форму регистрации, заполнение данных, выбор способа оплаты и успешный редирект на платежный шлюз Stripe.');
    await allure.link('https://freevpnplanet.com/', 'Главная страница FreeVPNPlanet');

    const uniqueEmail = `qa-auto-${Date.now()}@freevpnplanet.com`;

    await test.step('Открыть главную страницу', async () => {
      await homePage.goto(); 
    });

    await test.step('Перейти на форму входа (Log In)', async () => {
      await homePage.clickLogin();
    });

    await test.step('Переключиться на форму регистрации (Sign Up)', async () => {
      await loginPage.switchToSignUp();
    });

    await test.step('Заполнить данные заказа', async () => {
      await test.step(`Ввести email: "${uniqueEmail}"`, async () => {
        await orderPage.fillEmail(uniqueEmail);
      });
      await test.step('Нажать "Далее"', async () => {
        await orderPage.clickNext();
      });
      await test.step('Выбрать метод оплаты "Credit Card"', async () => {
        await orderPage.selectCreditCard();
      });
    });

    await test.step('Создать заказ и подтвердить оплату', async () => {
      let orderResponse: any;
      let stripeResponse: any;
      
      await test.step('Отправить форму заказа и дождаться ответов API', async () => {
        [orderResponse, stripeResponse] = await orderPage.submitOrderAndIntercept();
      });

      await test.step('Проверить успешность создания ордера (status 201)', async () => {
        expect(
          orderResponse.ok(), 
          '❌ Ошибка API: Бэкенд не смог создать ордер (ожидался статус 201)'
        ).toBeTruthy();
      });

      await test.step('Проверить инициализацию платежа Stripe (status 200)', async () => {
        expect(
          stripeResponse.ok(), 
          '❌ Ошибка API: Stripe шлюз отклонил инициализацию платежа (ожидался статус 200)'
        ).toBeTruthy();
      });
    });

    await test.step('Проверить редирект на платежный шлюз Stripe', async () => {
      await test.step('Ожидать загрузку страницы checkout', async () => {
        await page.waitForURL(/.*checkout.*/, { timeout: 30000, waitUntil: 'domcontentloaded' });
      });

      await test.step('Убедиться, что домен изменился на внешний шлюз', async () => {
        expect(
          page.url(),
          '❌ Ошибка UI: Редирект не произошел, пользователь остался на внутреннем домене'
        ).not.toContain('freevpnplanet.com');
      });
    });

  });

});