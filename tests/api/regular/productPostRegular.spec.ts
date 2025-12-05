import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import { ResponseValidator } from '../../../utils/responseValidator';
import { ProductFactory, Product } from '../../../utils/factories/productFactory';
import { LittleBugShop } from '../../../utils/urlBuilders/littleBugShopUrlBuilder';
import { TestDecorators, TestSeverity as Severity } from '../../../utils/testDecorators';

test.describe('Product Creation API Tests - Regular User Authorization - POST /api/Products', () => {
  let apiClient: ApiClient;
  let authToken: string;

  TestDecorators.setupTestDescribe({
    suite: 'Product Management API Tests',
    suiteDescription: 'Authorization boundary tests for the POST /api/Products endpoint with regular user',
    epic: 'Product Management',
    feature: 'Product Creation Authorization'
  });

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);

    // Login as regular user to get authentication token
    const loginResponse = await apiClient.post(LittleBugShop().Controllers.Users.login, {
      data: {
        username: 'User',
        password: 'qazwsxedcrfv12345'
      }
    });

    expect(loginResponse.status(), 'Regular user login should return 200 status').toBe(200);
    const loginResult = await ResponseValidator.getResponseBody<{ token: string }>(loginResponse);
    authToken = loginResult.token;
  });

  test('TC 001 Validate regular user cannot create product', async () => {
    await TestDecorators.setupTest({
      description: 'Validate regular user is forbidden from creating products',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let productData: Product;
    let response: any;

    await test.step('Generate product test data', async () => {
      productData = ProductFactory.generateProduct();
    });

    await test.step('Send product creation request as regular user', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    });

    await test.step('Verify request is rejected with 403 Forbidden', async () => {
      expect(response.status(), 'Regular user should be forbidden from creating products (403 Forbidden)').toBe(403);
    });
  });
});

