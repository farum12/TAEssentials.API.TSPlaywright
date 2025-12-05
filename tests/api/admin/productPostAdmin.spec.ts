// tests/api/admin/productPostAdmin.spec.ts

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import { ResponseValidator } from '../../../utils/responseValidator';
import { ProductFactory, Product } from '../../../utils/factories/productFactory';
import { LittleBugShop } from '../../../utils/urlBuilders/littleBugShopUrlBuilder';
import { TestDecorators, TestSeverity as Severity } from '../../../utils/testDecorators';

test.describe('Product Creation API Tests - Admin User Authorization - POST /api/Products', () => {
  let apiClient: ApiClient;
  let authToken: string;

  TestDecorators.setupTestDescribe({
    suite: 'Product Management API Tests',
    suiteDescription: 'Tests for the POST /api/Products endpoint',
    epic: 'Product Management',
    feature: 'Product Creation'
  });

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);

    // Login as admin to get authentication token
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

  test('TC 001P Validate successful product creation with valid data', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful product creation with all valid fields as admin',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let productData: Product;
    let response: any;
    let result: any;

    await test.step('Generate product test data', async () => {
      productData = ProductFactory.generateProduct();
    });

    await test.step('Send product creation request', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Validate response status and content type', async () => {
      expect(response.status(), 'Product creation should return 201 Created status').toBe(201);
      await ResponseValidator.validateContentType(response, 'application/json');
    });

    await test.step('Parse response body', async () => {
      result = await ResponseValidator.getResponseBody(response);
    });

    await test.step('Verify response structure and data', async () => {
      expect(result.id, 'Product ID should be defined in response').toBeDefined();
      expect(result.id, 'Product ID should be a positive number').toBeGreaterThan(0);
      expect(result.name, 'Product name should match request data').toBe(productData.name);
      expect(result.author, 'Product author should match request data').toBe(productData.author);
      expect(result.genre, 'Product genre should match request data').toBe(productData.genre);
      expect(result.isbn, 'Product ISBN should match request data').toBe(productData.isbn);
      expect(result.price, 'Product price should match request data').toBe(productData.price);
      expect(result.type, 'Product type should match request data').toBe(productData.type);
      expect(result.stockQuantity, 'Product stock quantity should match request data').toBe(productData.stockQuantity);
    });
  });

  test('TC 002P Validate product creation with minimal required fields', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful product creation with only required fields',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let productData: Product;
    let response: any;
    let result: any;

    await test.step('Generate minimal product test data', async () => {
      productData = ProductFactory.generateMinimalProduct();
    });

    await test.step('Send product creation request', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status(), 'Minimal product creation should return 201 Created status').toBe(201);
    });

    await test.step('Parse response body', async () => {
      result = await ResponseValidator.getResponseBody(response);
    });

    await test.step('Verify product data matches request', async () => {
      expect(result.name, 'Product name should match minimal request data').toBe(productData.name);
      expect(result.author, 'Product author should match minimal request data').toBe(productData.author);
      expect(result.isbn, 'Product ISBN should match minimal request data').toBe(productData.isbn);
    });
  });

  test('TC 003N Validate rejection of product creation with empty name', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects product creation with empty name field',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let productData: Product;
    let response: any;

    await test.step('Generate product data with empty name', async () => {
      productData = ProductFactory.generateProduct({ name: '' });
    });

    await test.step('Send product creation request with empty name', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status(), 'Product creation with empty name should be rejected with 400 Bad Request').toBe(400);
    });
  });

  test('TC 004N Validate rejection of product creation with negative price', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects product creation with negative price',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let productData: Product;
    let response: any;

    await test.step('Generate product data with negative price', async () => {
      productData = ProductFactory.generateProductWithNegativePrice();
    });

    await test.step('Send product creation request with negative price', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status(), 'Product creation with negative price should be rejected with 400 Bad Request').toBe(400);
    });
  });

  test('TC 005N Validate rejection of product creation with zero price', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects product creation with zero price',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let productData: Product;
    let response: any;

    await test.step('Generate product data with zero price', async () => {
      productData = ProductFactory.generateProductWithZeroPrice();
    });

    await test.step('Send product creation request with zero price', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status(), 'Product creation with zero price should be rejected with 400 Bad Request').toBe(400);
    });
  });

  test('TC 006N Validate product creation with invalid ISBN format', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API handling of invalid ISBN format',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let productData: Product;
    let response: any;

    await test.step('Generate product data with invalid ISBN', async () => {
      productData = ProductFactory.generateProductWithInvalidISBN();
    });

    await test.step('Send product creation request with invalid ISBN', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Verify response based on API validation rules', async () => {
      expect([400, 201], 'Invalid ISBN should either be rejected (400) or accepted (201) based on API rules').toContain(response.status());
    });
  });

  test('TC 007N Validate product creation with empty fields', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects product creation with all empty fields',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let productData: Product;
    let response: any;

    await test.step('Generate product data with empty fields', async () => {
      productData = ProductFactory.generateProductWithEmptyFields();
    });

    await test.step('Send product creation request with empty fields', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status(), 'Product creation with empty fields should be rejected with 400 Bad Request').toBe(400);
    });
  });

  test('TC 008P Validate response structure for successful product creation', async () => {
    await TestDecorators.setupTest({
      description: 'Validate response structure and data types for successful product creation',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let productData: Product;
    let response: any;
    let result: any;

    await test.step('Generate product test data', async () => {
      productData = ProductFactory.generateProduct();
    });

    await test.step('Send product creation request', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status(), 'Product creation for structure validation should return 201 Created').toBe(201);
    });

    await test.step('Parse response body', async () => {
      result = await ResponseValidator.getResponseBody(response);
    });

    await test.step('Validate response has required fields', async () => {
      await ResponseValidator.validateRequiredFields(result, [
        'id',
        'name',
        'author',
        'genre',
        'isbn',
        'price',
        'description',
        'type',
        'stockQuantity',
        'lowStockThreshold'
      ]);
    });

    await test.step('Validate field data types', async () => {
      expect(typeof result.id, 'Product ID should be a number').toBe('number');
      expect(typeof result.name, 'Product name should be a string').toBe('string');
      expect(typeof result.author, 'Product author should be a string').toBe('string');
      expect(typeof result.genre, 'Product genre should be a string').toBe('string');
      expect(typeof result.isbn, 'Product ISBN should be a string').toBe('string');
      expect(typeof result.price, 'Product price should be a number').toBe('number');
      expect(typeof result.description, 'Product description should be a string').toBe('string');
      expect(typeof result.type, 'Product type should be a string').toBe('string');
      expect(typeof result.stockQuantity, 'Product stock quantity should be a number').toBe('number');
      expect(typeof result.lowStockThreshold, 'Product low stock threshold should be a number').toBe('number');
    });
  });
});

