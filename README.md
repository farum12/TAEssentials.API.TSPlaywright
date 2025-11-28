# LittleBugShop API Test Automation

A comprehensive API test automation framework for **LittleBugShop** built with TypeScript and Playwright.

## 📋 About

This framework provides automated API testing for the LittleBugShop application, focusing on robust validation of API endpoints with comprehensive test coverage.

## ✨ Features

- **TypeScript** - Strong typing for better code quality
- **Playwright** - Fast and reliable API testing
- **Modular Architecture** - Clean separation of concerns
- **Logger** - Winston-based logging for better debugging
- **Test Data Generation** - Built-in utilities for test data
- **Response Validation** - Reusable validators for API responses
- **Multiple Reporters** - HTML, JSON, JUnit, and Allure reports
- **ESLint & Prettier** - Code quality and formatting

## 🔧 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- LittleBugShop API running on `http://localhost:5052`

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

## ⚙️ Configuration

The framework is pre-configured for LittleBugShop API:

- **Base URL**: `http://localhost:5052`
- **Swagger**: `http://localhost:5052/swagger/v1/swagger.json`

Update `.env` file if you need different settings:
```env
BASE_URL=http://localhost:5052
API_TIMEOUT=30000
TEST_ENV=local
LOG_LEVEL=info
```

## 📁 Project Structure

```
TAEssentials.API.TSPlaywright/
├── config/                 # Configuration files
│   └── api.config.ts      # API endpoints and settings
├── models/                 # Data models and interfaces
│   └── user.models.ts     # User-related models
├── tests/                  # Test files
│   └── api/               # API test suites
│       └── register.spec.ts  # User registration tests
├── utils/                  # Utility functions
│   ├── apiClient.ts       # API client wrapper
│   ├── logger.ts          # Winston logger configuration
│   ├── responseValidator.ts # Response validation utilities
│   └── testDataGenerator.ts # Test data generation
├── test-results/          # Test results (auto-generated)
├── reports/               # Test reports (auto-generated)
└── playwright.config.ts   # Playwright configuration
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

## 📝 Current Test Coverage

### User Registration (POST /api/Users/register)

✅ **Positive Scenarios:**
- Successful registration with all required fields
- Successful registration without optional phone number
- Response structure validation
- Special characters in username

✅ **Negative Scenarios:**
- Duplicate username rejection
- Duplicate email rejection
- Missing required fields (username, password, email)
- Invalid email format
- Weak password
- Empty string values

## 🛠️ Test Utilities

### URL Builder

Build API endpoint URLs with a fluent, type-safe interface:

```typescript
import { LittleBugShop } from '../../utils/urlBuilder';

// Basic usage
const url = LittleBugShop().Users.register();
// Returns: "http://localhost:5052/api/Users/register"

// With ID parameters
const userUrl = LittleBugShop().Users.getById(123);
// Returns: "http://localhost:5052/api/Users/123"

// Other endpoints
LittleBugShop().Users.login()
LittleBugShop().Products.getById(456)
LittleBugShop().Cart.checkout()
LittleBugShop().Orders.myOrders()
```

See [URL Builder Documentation](docs/UrlBuilder.md) for complete API reference.

### UserFactory

Generate realistic user test data using Faker:

```typescript
import { UserFactory } from '../../utils/userFactory';

// Generate complete user with all fields
const user = UserFactory.generateUser();

// Generate user with only required fields
const minimalUser = UserFactory.generateMinimalUser();

// Generate user with custom fields
const customUser = UserFactory.generateUser({
  firstName: 'John',
  email: 'custom@example.com'
});

// Generate unique identifiers
const username = UserFactory.generateUniqueUsername();
const email = UserFactory.generateUniqueEmail();

// Negative testing scenarios
const invalidEmailUser = UserFactory.generateUserWithInvalidEmail();
const weakPasswordUser = UserFactory.generateUserWithWeakPassword();
const emptyUser = UserFactory.generateUserWithEmptyFields();
```

See [UserFactory Documentation](docs/UserFactory.md) for complete usage guide.

### API Client
```typescript
const response = await apiClient.post(endpoints.register, { data: registerData });
```

### Response Validator
```typescript
await ResponseValidator.validateStatusCode(response, 200);
await ResponseValidator.validateContentType(response, 'application/json');
const body = await ResponseValidator.getResponseBody<RegisterResponse>(response);
```

### Test Data Generator
```typescript
const email = TestDataGenerator.generateRandomEmail();
const username = `testuser_${TestDataGenerator.generateRandomString(8)}`;
```

## 📊 Reporting

The framework generates multiple report formats:

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

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

## 🔗 API Documentation

Swagger UI: `http://localhost:5052/swagger/v1/swagger.json`

## 📝 License

ISC

---

**Happy Testing! 🎯**
