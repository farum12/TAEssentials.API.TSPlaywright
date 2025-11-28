# TAEssentials API Test Automation with TypeScript & Playwright

A comprehensive API test automation framework built with TypeScript and Playwright for robust API testing.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Utilities](#utilities)
- [Reporting](#reporting)

## ✨ Features

- **TypeScript** - Strong typing for better code quality
- **Playwright** - Fast and reliable API testing
- **Modular Architecture** - Clean separation of concerns
- **Logger** - Winston-based logging for better debugging
- **Test Data Generation** - Built-in utilities for test data
- **Response Validation** - Reusable validators for API responses
- **Multiple Reporters** - HTML, JSON, JUnit, and Allure reports
- **ESLint & Prettier** - Code quality and formatting
- **Environment Configuration** - Easy configuration through .env files

## 🔧 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TAEssentials.API.TSPlaywright
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Create environment configuration:
```bash
cp .env.example .env
```

5. Update `.env` file with your API configuration:
```env
BASE_URL=https://api.example.com
API_TIMEOUT=30000
API_KEY=your_api_key_here
AUTH_TOKEN=your_auth_token_here
TEST_ENV=staging
LOG_LEVEL=info
```

## 📁 Project Structure

```
TAEssentials.API.TSPlaywright/
├── config/                 # Configuration files
│   └── api.config.ts      # API endpoints and settings
├── models/                 # Data models and interfaces
│   └── api.models.ts      # API response models
├── tests/                  # Test files
│   └── api/               # API test suites
│       ├── users.spec.ts  # User API tests
│       └── posts.spec.ts  # Posts API tests
├── utils/                  # Utility functions
│   ├── apiClient.ts       # API client wrapper
│   ├── logger.ts          # Winston logger configuration
│   ├── responseValidator.ts # Response validation utilities
│   └── testDataGenerator.ts # Test data generation
├── test-results/          # Test results (auto-generated)
├── reports/               # Test reports (auto-generated)
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies
└── .env                   # Environment variables
```

## ⚙️ Configuration

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test directory
- Parallel execution
- Retries
- Reporters
- Timeouts
- Base URL

### API Configuration

Edit `config/api.config.ts` to add/modify:
- API endpoints
- Environment-specific settings
- Default headers

## 🚀 Running Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode:
```bash
npm run test:headed
```

Run tests in debug mode:
```bash
npm run test:debug
```

Run only API tests:
```bash
npm run test:api
```

Run tests with UI mode:
```bash
npm run test:ui
```

Show test report:
```bash
npm run test:report
```

## ✍️ Writing Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { ResponseValidator } from '../../utils/responseValidator';
import { endpoints } from '../../config/api.config';

test.describe('API Test Suite', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('should perform API operation', async () => {
    const response = await apiClient.get(endpoints.users);
    await ResponseValidator.validateStatusCode(response, 200);
    
    const data = await ResponseValidator.getResponseBody(response);
    expect(data).toBeDefined();
  });
});
```

## 🛠️ Utilities

### API Client

Wrapper around Playwright's request context with logging:
```typescript
const response = await apiClient.get('/endpoint');
const response = await apiClient.post('/endpoint', { data: payload });
const response = await apiClient.put('/endpoint', { data: payload });
const response = await apiClient.delete('/endpoint');
```

### Response Validator

Reusable validation methods:
```typescript
await ResponseValidator.validateStatusCode(response, 200);
await ResponseValidator.validateContentType(response, 'application/json');
await ResponseValidator.validateRequiredFields(data, ['id', 'name']);
const body = await ResponseValidator.getResponseBody<User>(response);
```

### Test Data Generator

Generate random test data:
```typescript
const email = TestDataGenerator.generateRandomEmail();
const string = TestDataGenerator.generateRandomString(10);
const number = TestDataGenerator.generateRandomNumber(1, 100);
const uuid = TestDataGenerator.generateUUID();
```

## 📊 Reporting

The framework generates multiple report formats:

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`
- **Allure Report**: Generate with `allure generate allure-results`

## 🧹 Code Quality

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## 📝 License

ISC

## 👥 Author

Your Name

---

**Happy Testing! 🎯**
