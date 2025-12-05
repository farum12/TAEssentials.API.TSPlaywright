# TAEssentials.API.TSPlaywright

A comprehensive TypeScript-based API testing framework built with Playwright, designed for testing the LittleBugShop API with professional-grade test organization, reporting, and maintainability.

## 🎯 Overview

This project demonstrates enterprise-level API testing practices using TypeScript and Playwright Test, featuring:

- **Structured test organization** by authorization levels (admin, regular user, unauthorized)
- **Factory pattern** for test data generation with Faker.js
- **Fluent URL builder** for endpoint construction
- **Comprehensive test reporting** with Allure integration
- **Type-safe utilities** for API interactions and response validation
- **Self-documenting tests** with meaningful assertions and step-by-step reporting

## 🏗️ Architecture

```
TAEssentials.API.TSPlaywright/
├── tests/
│   └── api/
│       ├── admin/              # Admin-level operation tests
│       ├── regular/            # Regular user authorization tests
│       └── unauthorized/       # Unauthenticated/public endpoint tests
├── utils/
│   ├── factories/              # Test data generators (ProductFactory, UserFactory)
│   ├── urlBuilders/            # Fluent API for endpoint URLs
│   ├── apiClient.ts            # HTTP client wrapper
│   ├── logger.ts               # Winston-based logging
│   ├── responseValidator.ts    # Response validation utilities
│   └── testDecorators.ts       # Unified test metadata for Playwright + Allure
├── models/                     # TypeScript interfaces for requests/responses
└── config/                     # Configuration files
```

## ✨ Features

### Test Organization
- **Role-based directory structure**: Separate test suites for admin, regular users, and unauthenticated scenarios
- **Test case naming convention**: `TC ###P` for positive tests, `TC ###N` for negative tests
- **Minimal redundancy**: Authorization tests focus on access control, not data validation

### Factory Pattern
```typescript
// Generate realistic test data
const product = ProductFactory.generateProduct();
const invalidProduct = ProductFactory.generateProductWithNegativePrice();
const user = UserFactory.generateUser();
```

### URL Builder
```typescript
// Fluent, type-safe endpoint construction
await apiClient.post(LittleBugShop().Controllers.Products.create, { data });
await apiClient.post(LittleBugShop().Controllers.Users.register, { data });
```

### Test Decorators
```typescript
// Unified metadata for Playwright and Allure
TestDecorators.setupTestDescribe({
  suite: 'Product Management API Tests',
  epic: 'Product Management',
  feature: 'Product Creation'
});

await TestDecorators.setupTest({
  description: 'Validate successful product creation',
  owner: 'Farum',
  severity: Severity.CRITICAL
});
```

### Meaningful Assertions
Every assertion includes a descriptive error message:
```typescript
expect(response.status(), 'Product creation should return 201 Created status').toBe(201);
expect(result.id, 'Product ID should be a positive number').toBeGreaterThan(0);
expect(response.status(), 'Regular user should be forbidden from creating products (403 Forbidden)').toBe(403);
```

## 🛠️ Tech Stack

- **TypeScript 5.3.0**: Type-safe test development
- **Playwright Test 1.40.0**: Modern API testing framework
- **Faker.js 10.1.0**: Realistic test data generation
- **Allure 2.10.0**: Rich test reporting
- **Winston 3.11.0**: Structured logging
- **date-fns 2.30.0**: Date formatting utilities

## 🔧 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- LittleBugShop API running on `http://localhost:5052`

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/farum12/TAEssentials.API.TSPlaywright.git
cd TAEssentials.API.TSPlaywright

# Install dependencies
npm install
```

## 🧪 Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test suite
npx playwright test tests/api/admin/

# Run tests with specific tag
npx playwright test --grep @critical

# Generate Allure report
npm run report:generate
npm run report:open
```

## 📊 Test Coverage

### Product Management API
- **Admin Tests** (`tests/api/admin/productPostAdmin.spec.ts`):
  - ✅ TC 001P: Successful product creation with valid data
  - ✅ TC 002P: Product creation with minimal required fields
  - ❌ TC 003N: Rejection of invalid data (empty name)
  - ❌ TC 004N: Rejection of negative price
  - ❌ TC 005N: Rejection of zero price
  - ❌ TC 006N: Invalid ISBN format handling
  - ❌ TC 007N: Rejection of empty fields
  - ✅ TC 008P: Response structure validation

- **Authorization Tests** (`tests/api/regular/productPostRegular.spec.ts`):
  - ❌ TC 001N: Regular user forbidden from creating products (403)
  
- **Authentication Tests** (`tests/api/unauthorized/productPostUnauthorized.spec.ts`):
  - ❌ TC 001N: Unauthenticated requests rejected (401)

### User Management API
- **User Registration** (`tests/api/unauthorized/userRegisterPostUnauthorized.spec.ts`):
  - ✅ TC 001P: Successful registration with valid data
  - ✅ TC 002P: Registration without optional fields
  - ❌ TC 003N: Duplicate username rejection
  - ❌ TC 004N: Duplicate email rejection
  - ❌ TC 005N: Required field validation (username)
  - ❌ TC 006N: Required field validation (password)
  - ❌ TC 007N: Required field validation (email)
  - ❌ TC 008N: Email format validation
  - ❌ TC 009N: Password strength requirements
  - ❌ TC 010N: Empty string values rejection
  - ❌ TC 011N: Special characters in username handling
  - ✅ TC 012P: Response structure validation

## ⚙️ Configuration

The framework is pre-configured for LittleBugShop API:

- **Base URL**: `http://localhost:5052`
- **Admin Credentials**: username: `admin`, password: `admin123`
- **Regular User Credentials**: username: `User`, password: `qazwsxedcrfv12345`
## 📖 Documentation

- **[TESTING_STANDARDS.md](TESTING_STANDARDS.md)**: Comprehensive guide to coding standards, naming conventions, and best practices

## 🎓 Best Practices Demonstrated

1. **Self-Documenting Tests**: Clear test names, descriptive step labels, and meaningful assertion messages
2. **DRY Principle**: Factory pattern eliminates hardcoded test data
3. **Type Safety**: Full TypeScript integration with interfaces and generics
4. **Separation of Concerns**: Utilities, factories, and tests are clearly separated
5. **Test Organization**: Role-based directory structure for scalability
6. **Fail Fast, Fail Clear**: Detailed error messages pinpoint exact failure reasons

## 🤝 Contributing

Contributions are welcome! Please follow the standards outlined in `TESTING_STANDARDS.md` to maintain consistency.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards in `TESTING_STANDARDS.md`
4. Add tests with proper TC naming (TC ###P/TC ###N)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is part of the Test Automation Essentials series.

## 👤 Author

**Farum**
- GitHub: [@farum12](https://github.com/farum12)

## 🙏 Acknowledgments

- Built for testing the LittleBugShop API
- Inspired by enterprise API testing best practices
- Powered by the Playwright Test framework

---

**Note**: Ensure the LittleBugShop API is running on `http://localhost:5052` before executing tests.

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
## 📖 Documentation

- **[TESTING_STANDARDS.md](TESTING_STANDARDS.md)**: Comprehensive guide to coding standards, naming conventions, and best practices

## 🎓 Best Practices Demonstrated

1. **Self-Documenting Tests**: Clear test names, descriptive step labels, and meaningful assertion messages
2. **DRY Principle**: Factory pattern eliminates hardcoded test data
3. **Type Safety**: Full TypeScript integration with interfaces and generics
4. **Separation of Concerns**: Utilities, factories, and tests are clearly separated
5. **Test Organization**: Role-based directory structure for scalability
6. **Fail Fast, Fail Clear**: Detailed error messages pinpoint exact failure reasons

## 🤝 Contributing

Contributions are welcome! Please follow the standards outlined in `TESTING_STANDARDS.md` to maintain consistency.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards in `TESTING_STANDARDS.md`
4. Add tests with proper TC naming (TC ###P/TC ###N)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is part of the Test Automation Essentials series.

## 👤 Author

**Farum**
- GitHub: [@farum12](https://github.com/farum12)

## 🙏 Acknowledgments

- Built for testing the LittleBugShop API
- Inspired by enterprise API testing best practices
- Powered by the Playwright Test framework

---

**Note**: Ensure the LittleBugShop API is running on `http://localhost:5052` before executing tests.
