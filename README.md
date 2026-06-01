# 🌍 Free VPN Planet - E2E Automation QA Assignment

![Playwright Tests](https://github.com/RustamSDET/test-assignment-ts-playwright/actions/workflows/playwright.yml/badge.svg)
[![Allure Report](https://img.shields.io/badge/Allure%20Report-gh--pages-brightgreen)](https://rustamsdet.github.io/test-assignment-ts-playwright/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](#)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](#)

Тестовое задание на позицию QA Automation Engineer / SDET. Проект представляет собой масштабируемый фреймворк для E2E тестирования процессов регистрации и покупки подписок на сайтах `freevpnplanet.com`, `planetconfig.com` и `personal.freevpnplanet.com`.

## 🚀 Ключевые особенности фреймворка

- **Архитектура Page Object Model (POM):** Строгое разделение логики страниц (`pages/`) и переиспользуемых элементов (`components/`). Тесты остаются чистыми и декларативными.
- **Data-Driven Testing (DDT):** Тестовые данные и платежные матрицы вынесены в `data/`. Для добавления новой платежной системы достаточно добавить одну строку в массив.
- **Boundary Testing & Payload Validation:** Тесты не зависят от хрупкого антифрода на Production-окружении. Настроена строгая валидация `POST`-запросов (Payload) перед редиректом.
- **Smart Waits & Network Interception:** Ожидание загрузки страниц и обработка редиректов реализованы через перехват сетевых запросов и URL-предикаты, что исключает таймауты и Flaky-тесты.
- **CI/CD Integration:** Настроен GitHub Actions пайплайн с автоматической генерацией и публикацией отчетов Allure на GitHub Pages.

## 🛠 Технологический стек

- **Язык:** TypeScript
- **Фреймворк:** Playwright Test
- **Отчетность:** Allure Reports
- **CI/CD:** GitHub Actions + GitHub Pages

## 📁 Структура проекта

```text
├── .github/workflows/   # CI/CD пайплайны (Playwright + Allure)
├── components/          # Инкапсулированные UI-компоненты (формы, виджеты)
├── pages/               # Page Objects (описание страниц)
├── tests/               # E2E тесты (*.spec.ts)
├── data/                # Тестовые данные (платежные матрицы)
├── fixtures/            # Playwright фикстуры для инъекции зависимостей
├── playwright.config.ts # Глобальная конфигурация фреймворка
└── package.json         # Зависимости и npm-скрипты
```

## ⚙️ Установка и локальный запуск

1. **Клонировать репозиторий:**

   ```bash
   git clone [https://github.com/RustamSDET/test-assignment-ts-playwright.git](https://github.com/RustamSDET/test-assignment-ts-playwright.git)
   cd test-assignment-ts-playwright
   ```

2. **Установить зависимости:**

   ```bash
   npm ci
   ```

3. **Установить браузеры Playwright:**

   ```bash
   npx playwright install --with-deps
   ```

4. **Запуск тестов:**
   - Запуск всех тестов в headless режиме (параллельно):
     ```bash
     npm run test
     ```
   - Запуск с открытием браузера (UI mode):
     ```bash
     npx playwright test --ui
     ```
   - Запуск конкретного проекта (например, только RU-сайт):
     ```bash
     npx playwright test --project=PurchaseRU
     ```

## 📊 Отчетность (Allure)

Фреймворк автоматически собирает результаты для Allure. Чтобы сгенерировать и открыть отчет локально, выполните:

```bash
npm run allure:generate
npm run allure:open
```

🌐 **[Посмотреть актуальный Allure Report (GitHub Pages)](https://rustamsdet.github.io/test-assignment-ts-playwright/)**

## 🏗 Архитектурные решения и анализ (Для ревьюера)

В ходе автоматизации на Production-окружении были выявлены ограничения стабильности (Flaky-эффект из-за антифрод-систем банков и динамической ротации шлюзов эквайринга).

Для обеспечения 100% стабильности тестов применены следующие инженерные паттерны:

1. **Динамический маппинг элементов:** Локаторы платежных систем привязаны к бизнес-тексту (`label`, `hasText`)
2. **Валидация контракта:** Вместо жесткого ожидания загрузки внешнего банковского шлюза (который может блокировать тестовый IP), фреймворк перехватывает `POST /payment` и валидирует отправленный на бэкенд Payload (email, ID шлюза, тариф).
3. **Предикатный роутинг:** Проверка редиректа реализована через умный колбэк `page.waitForURL()`, который успешно обрабатывает как уход на внешний домен, так и внутренний редирект на `/failed/` (вызванный антифродом).

Подробный анализ проблем UX, верстки (Accessibility скрытых чекбоксов) и рекомендации по улучшению описаны в [Техническом отчете / Google Document](https://docs.google.com/document/d/1Rw51QXZjYbi8nHfCUePvmRGLDoVI5GOCHzrs7_7WTEI/edit?usp=sharing).
