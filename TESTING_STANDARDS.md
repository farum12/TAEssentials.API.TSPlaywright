# TypeScript/Playwright API Testing Framework - Standards & Best Practices

This document outlines the coding standards, naming conventions, and best practices for this API testing framework.

---

## 1. Test File Structure & Organization

### 1.1 File Path Comment
**ALWAYS start every test file with a comment indicating its path relative to project root.**

```typescript
// tests/api/admin/productPostAdmin.spec.ts
```

This helps with:
- Quick file identification in search results
- Understanding file location when viewing isolated code
- Easier navigation in large projects

### 1.2 Import Order
Maintain consistent import organization:
1. Playwright testing utilities (`@playwright/test`)
2. Project utilities (ApiClient, ResponseValidator, Factories, URL Builders)
3. Models/Interfaces
4. Test decorators and severity enums

```typescript
// tests/api/admin/productPostAdmin.spec.ts

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import { ResponseValidator } from '../../../utils/responseValidator';
import { ProductFactory, Product } from '../../../utils/factories/productFactory';
import { LittleBugShop } from '../../../utils/urlBuilders/littleBugShopUrlBuilder';
import { TestDecorators, TestSeverity as Severity } from '../../../utils/testDecorators';
```

### 1.2 Directory Structure
Organize tests by authorization level/user role:
- `tests/api/admin/` - Tests requiring admin privileges
- `tests/api/regular/` - Tests with regular user authentication
- `tests/api/unauthorized/` - Tests without authentication or public endpoints

### 1.3 Test Describe Block Pattern
```typescript
test.describe('Feature Description - Authorization Level - HTTP Method Endpoint', () => {
  let apiClient: ApiClient;
  let authToken: string; // Optional: only if authentication required
  
  TestDecorators.setupTestDescribe({
    suite: 'Suite Name',
    suiteDescription: 'Detailed suite description',
    epic: 'Epic Name',
    feature: 'Feature Name'
  });
  
  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
    // Authentication logic if needed
  });
  
  // Test cases...
});
```

---

## 2. Test Naming Convention

### 2.1 Test Case ID Format
**Pattern**: `TC ###P` or `TC ###N`

- **P suffix** = Positive test case (expects success: 200, 201, 204, etc.)
- **N suffix** = Negative test case (expects failure: 400, 401, 403, 404, 422, etc.)
- **Sequential numbering** starting from 001

**Examples**:
```typescript
test('TC 001P Validate successful product creation with valid data', async () => {
test('TC 002P Validate product creation with minimal required fields', async () => {
test('TC 003N Validate rejection of product creation with empty name', async () => {
test('TC 004N Validate rejection of product creation with negative price', async () => {
```

### 2.2 Test Title Structure
Format: `TC ###P/N [Action/Validation] [detailed description]`

Guidelines:
- Start with action verb: Validate, Verify, Ensure
- Be specific about what is being tested
- Indicate expected outcome clearly

---

## 3. Test Implementation Patterns

### 3.1 Variable Declaration Pattern
Declare variables at the start of each test:

```typescript
test('TC 001P Validate successful creation', async () => {
  let requestData: RequestType;
  let response: any;
  let result: ResponseType; // Only if parsing response body
  
  // Test steps...
});
```

### 3.2 test.step() Organization
**ALWAYS** wrap actions in `test.step()` for better reporting and debugging.

**Standard Step Patterns**:
1. **Data Generation**: `'Generate [type] test data'`
2. **API Call**: `'Send [action] request'` or `'Send [action] request as [role]'`
3. **Status Validation**: `'Validate response status'` or `'Verify request is rejected with [code]'`
4. **Response Parsing**: `'Parse response body'` (only when needed)
5. **Data Verification**: `'Verify [specific aspect]'` or `'Validate [field] matches request'`

**Example**:
```typescript
await test.step('Generate product test data', async () => {
  productData = ProductFactory.generateProduct();
});

await test.step('Send product creation request', async () => {
  response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
    data: productData,
    headers: { Authorization: `Bearer ${authToken}` }
  });
});

await test.step('Validate response status', async () => {
  expect(response.status(), 'Product creation should return 201 Created status').toBe(201);
});
```

### 3.3 Meaningful Assertion Messages
**Every `expect()` MUST have a descriptive error message.**

**Format**: `'[What is being tested] should [expected behavior]'`

**Examples**:
```typescript
expect(response.status(), 'Product creation should return 201 Created status').toBe(201);
expect(result.id, 'Product ID should be defined in response').toBeDefined();
expect(result.id, 'Product ID should be a positive number').toBeGreaterThan(0);
expect(result.name, 'Product name should match request data').toBe(productData.name);
expect(response.status(), 'Regular user should be forbidden from creating products (403 Forbidden)').toBe(403);
expect(response.status(), 'Product creation without authentication should be rejected with 401 Unauthorized').toBe(401);
expect(response.status(), 'Product creation with empty name should be rejected with 400 Bad Request').toBe(400);
```

---

## 4. Authentication & Authorization Patterns

### 4.1 Authentication in beforeEach

#### 4.1.1 Single User Context
For tests requiring only one user role, use `async ({ request })`:

```typescript
test.beforeEach(async ({ request }) => {
  apiClient = new ApiClient(request);

  // Login as [role] to get authentication token
  const loginResponse = await apiClient.post(LittleBugShop().Controllers.Users.login, {
    data: {
      username: 'admin',
      password: 'admin123'
    }
  });

  expect(loginResponse.status(), 'Admin login should return 200 status').toBe(200);
  const loginResult = await ResponseValidator.getResponseBody<{ token: string }>(loginResponse);
  authToken = loginResult.token;
});
```

#### 4.1.2 Multiple User Contexts
**CRITICAL**: For tests requiring multiple user roles (e.g., admin + regular user), use `async ({ browser })` to create separate browser contexts. This prevents mixing user sessions.

```typescript
test.beforeEach(async ({ browser }) => {
  // Create separate context for regular user
  let apiRequestContextRegular = (await browser.newContext()).request;
  apiClientRegular = new ApiClient(apiRequestContextRegular);

  const loginResponse = await apiClientRegular.post(LittleBugShop().Controllers.Users.login, {
    data: {
      username: 'User',
      password: 'qazwsxedcrfv12345'
    }
  });
  expect(loginResponse.status(), 'Regular user login should return 200 status').toBe(200);
  const loginResult = await ResponseValidator.getResponseBody<{ token: string }>(loginResponse);
  authTokenRegular = loginResult.token;

  // Create separate context for admin user
  let apiRequestContextAdmin = (await browser.newContext()).request;
  apiClientAdmin = new ApiClient(apiRequestContextAdmin);

  const adminLoginResponse = await apiClientAdmin.post(LittleBugShop().Controllers.Users.login, {
    data: {
      username: 'admin',
      password: 'admin123'
    }
  });
  expect(adminLoginResponse.status(), 'Admin user login should return 200 status').toBe(200);
  const adminLoginResult = await ResponseValidator.getResponseBody<{ token: string }>(adminLoginResponse);
  authTokenAdmin = adminLoginResult.token;
});
```

**Why this matters**: Each `browser.newContext()` creates an isolated browser context with its own cookies, storage, and cache. This ensures that authentication tokens and session data don't leak between different user roles in the same test.

**Credentials**:
- **Admin**: username: `'admin'`, password: `'admin123'`
- **Regular User**: username: `'User'`, password: `'qazwsxedcrfv12345'`

### 4.2 Authorization Test Minimalism
**Keep authorization boundary tests minimal (2-3 test cases max).**

Don't duplicate data validation scenarios across different user roles. Focus on:
- **Authenticated but unauthorized** (403 Forbidden) - regular user attempting admin action
- **Unauthenticated** (401 Unauthorized) - no auth token provided

**Example** (Regular User - Minimal):
```typescript
test('TC 001N Validate regular user cannot create product', async () => {
  // Single test with valid product data - expects 403
});
```

**Example** (Unauthorized - Minimal):
```typescript
test('TC 001N Validate unauthenticated product creation is rejected', async () => {
  // Single test without auth token - expects 401
});
```

---

## 5. Code Quality Standards

### 5.1 Use Factory Pattern for Test Data
**NEVER hardcode test data in tests.**

Use factory methods for all test data generation:
```typescript
// ✅ CORRECT
productData = ProductFactory.generateProduct();
productData = ProductFactory.generateProductWithNegativePrice();
userData = UserFactory.generateUser();
userData = UserFactory.generateUserWithInvalidEmail();

// ❌ WRONG
productData = {
  name: 'Test Product',
  author: 'Test Author',
  // ...
};
```

### 5.2 Use URL Builder Pattern
**ALWAYS use URL Builder. NEVER hardcode endpoint URLs.**

```typescript
// ✅ CORRECT
await apiClient.post(LittleBugShop().Controllers.Products.create, { data });
await apiClient.post(LittleBugShop().Controllers.Users.register, { data });
await apiClient.post(LittleBugShop().Controllers.Users.login, { data });

// ❌ WRONG
await apiClient.post('/api/Products', { data });
await apiClient.post('http://localhost:5052/api/Users/register', { data });
```

### 5.3 TestDecorators Usage
Apply metadata consistently:

```typescript
// At describe block level (once per file)
TestDecorators.setupTestDescribe({
  suite: 'Product Management API Tests',
  suiteDescription: 'Tests for the POST /api/Products endpoint',
  epic: 'Product Management',
  feature: 'Product Creation'
});

// At test level (every test)
await TestDecorators.setupTest({
  description: 'Validate successful product creation with all valid fields as admin',
  owner: 'Farum',
  severity: Severity.CRITICAL // or NORMAL, MINOR
});
```

### 5.4 Type Safety
Leverage TypeScript for type safety:

```typescript
// Use typed interfaces for requests/responses
let registerData: RegisterRequest;
let result: RegisterResponse;

// Use generics in ResponseValidator
result = await ResponseValidator.getResponseBody<RegisterResponse>(response);
const loginResult = await ResponseValidator.getResponseBody<{ token: string }>(loginResponse);
```

---

## 6. File Naming Conventions

### 6.1 Test File Names
**Pattern**: `[resource][HttpMethod][UserRole].spec.ts`

**Examples**:
- `productPostAdmin.spec.ts` - Admin creating products
- `productPostRegular.spec.ts` - Regular user attempting to create products
- `productPostUnauthorized.spec.ts` - Unauthenticated product creation
- `userRegisterPostUnauthorized.spec.ts` - Public user registration

### 6.2 Utility File Names
- Use camelCase: `apiClient.ts`, `responseValidator.ts`
- Factory files: `productFactory.ts`, `userFactory.ts`
- URL Builders: `littleBugShopUrlBuilder.ts`

---

## 7. Test Data Management

### 7.1 Factory Methods
Each factory should provide:
- `generate[Entity]()` - Full valid entity with all fields
- `generateMinimal[Entity]()` - Only required fields
- `generate[Entity]With[Variation]()` - Specific test scenarios
  - `generateProductWithNegativePrice()`
  - `generateProductWithEmptyFields()`
  - `generateUserWithInvalidEmail()`
  - `generateUserWithWeakPassword()`

### 7.2 Data Uniqueness
For fields requiring uniqueness (username, email):
```typescript
username = UserFactory.generateUniqueUsername();
email = UserFactory.generateUniqueEmail();
userData = UserFactory.generateUserWithUsername(username);
```

---

## 8. Response Validation Patterns

### 8.1 Status Code Validation
Always validate status codes with descriptive messages:
```typescript
// Positive scenarios
expect(response.status(), 'Product creation should return 201 Created status').toBe(201);
expect(response.status(), 'User registration should return 201 Created status').toBe(201);

// Negative scenarios
expect(response.status(), 'Empty name should be rejected with 400 Bad Request').toBe(400);
expect(response.status(), 'Unauthenticated request should return 401 Unauthorized').toBe(401);
expect(response.status(), 'Insufficient permissions should return 403 Forbidden').toBe(403);
```

### 8.2 Response Structure Validation
```typescript
await test.step('Validate response has required fields', async () => {
  await ResponseValidator.validateRequiredFields(result, [
    'id',
    'name',
    'author',
    'price'
  ]);
});

await test.step('Validate field data types', async () => {
  expect(typeof result.id, 'Product ID should be a number').toBe('number');
  expect(typeof result.name, 'Product name should be a string').toBe('string');
  expect(typeof result.price, 'Product price should be a number').toBe('number');
});
```

### 8.3 Response Data Validation
```typescript
await test.step('Verify response structure and data', async () => {
  expect(result.id, 'Product ID should be defined in response').toBeDefined();
  expect(result.id, 'Product ID should be a positive number').toBeGreaterThan(0);
  expect(result.name, 'Product name should match request data').toBe(productData.name);
  expect(result.author, 'Product author should match request data').toBe(productData.author);
});
```

---

## 9. Key Principles

### 9.1 Self-Documenting Tests
Tests should be readable without additional documentation:
- Clear test names that describe intent
- Descriptive step names that explain actions
- Meaningful assertion messages that clarify expectations

### 9.2 Single Responsibility
Each test should verify ONE specific behavior or scenario:
- ✅ One test for valid data creation
- ✅ One test for empty name rejection
- ✅ One test for negative price rejection
- ❌ Don't combine multiple validation scenarios in one test

### 9.3 Minimal Redundancy
- Don't test the same validation rules across different user roles
- Admin tests focus on: data validation, business logic, response structure
- Authorization tests focus on: access control, status codes (401/403)

### 9.4 Fail Fast, Fail Clear
When a test fails, the error should immediately reveal:
1. **What** was being tested
2. **What** was expected
3. **What** actually happened

This is achieved through meaningful assertion messages.

---

## 10. Common Patterns Reference

### 10.1 Positive Test Pattern (Admin)
```typescript
test('TC 001P Validate successful [action] with valid data', async () => {
  let requestData: Type;
  let response: any;
  let result: ResponseType;

  await test.step('Generate test data', async () => {
    requestData = Factory.generate();
  });

  await test.step('Send request', async () => {
    response = await apiClient.post(endpoint, { data: requestData, headers: { Authorization: `Bearer ${authToken}` } });
  });

  await test.step('Validate response status', async () => {
    expect(response.status(), 'Action should return 201 Created status').toBe(201);
  });

  await test.step('Parse response body', async () => {
    result = await ResponseValidator.getResponseBody<ResponseType>(response);
  });

  await test.step('Verify response data', async () => {
    expect(result.field, 'Field should match request').toBe(requestData.field);
  });
});
```

### 10.2 Negative Test Pattern (Validation)
```typescript
test('TC 003N Validate rejection of [invalid scenario]', async () => {
  let requestData: Type;
  let response: any;

  await test.step('Generate invalid test data', async () => {
    requestData = Factory.generateWithInvalid();
  });

  await test.step('Send request with invalid data', async () => {
    response = await apiClient.post(endpoint, { data: requestData, headers: { Authorization: `Bearer ${authToken}` } });
  });

  await test.step('Verify request is rejected with 400', async () => {
    expect(response.status(), 'Invalid data should be rejected with 400 Bad Request').toBe(400);
  });
});
```

### 10.3 Authorization Test Pattern
```typescript
test('TC 001N Validate [role] cannot [action]', async () => {
  let requestData: Type;
  let response: any;

  await test.step('Generate test data', async () => {
    requestData = Factory.generate();
  });

  await test.step('Send request as [role]', async () => {
    response = await apiClient.post(endpoint, { data: requestData, headers: { Authorization: `Bearer ${authToken}` } });
  });

  await test.step('Verify request is rejected with 403 Forbidden', async () => {
    expect(response.status(), 'Regular user should be forbidden from [action] (403 Forbidden)').toBe(403);
  });
});
```

---

## Version History

- **v1.0** - Initial standards documentation (December 5, 2025)
- Established during development of LittleBugShop API test framework
- Based on TypeScript 5.3.0, Playwright 1.40.0, Allure 2.10.0

---

**Remember**: These standards ensure maintainability, readability, and debugging efficiency. Follow them consistently across all test files.
