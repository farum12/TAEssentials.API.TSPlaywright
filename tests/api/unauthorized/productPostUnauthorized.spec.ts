// tests/api/unauthorized/productPostUnauthorized.spec.ts

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import { ProductFactory, Product } from '../../../utils/factories/productFactory';
import { LittleBugShop } from '../../../utils/urlBuilders/littleBugShopUrlBuilder';
import { TestDecorators, TestSeverity as Severity } from '../../../utils/testDecorators';

test.describe('Product Creation API Tests - Regular User Authorization - POST /api/Products', () => {
  let apiClient: ApiClient;

  TestDecorators.setupTestDescribe({
    suite: 'Product Management API Tests',
    suiteDescription: 'Authorization boundary tests for the POST /api/Products endpoint with unauthorized user',
    epic: 'Product Management',
    feature: 'Product Creation Authorization'
  });

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);

    // Do not login to get authentication token as this test is for unauthorized access
  });

  test('TC 001N Validate unauthenticated product creation is rejected', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects product creation without authentication',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let productData: Product;
    let response: any;

    await test.step('Generate product test data', async () => {
      productData = ProductFactory.generateProduct();
    });

    await test.step('Send product creation request without auth token', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Products.create, {
        data: productData
      });
    });

    await test.step('Verify request is rejected with 401 Unauthorized', async () => {
      expect(response.status(), 'Product creation without authentication should be rejected with 401 Unauthorized').toBe(401);
    });
  });
});

