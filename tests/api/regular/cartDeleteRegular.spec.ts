// tests/api/regular/cartDeleteRegular.spec.ts

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import { ResponseValidator } from '../../../utils/responseValidator';
import { CartFactory, AddCartItemRequest } from '../../../utils/factories/cartFactory';
import { ProductFactory, Product } from '../../../utils/factories/productFactory';
import { LittleBugShop } from '../../../utils/urlBuilders/littleBugShopUrlBuilder';
import { TestDecorators, TestSeverity as Severity } from '../../../utils/testDecorators';

test.describe('Cart Management API Tests - Regular User - DELETE /api/Cart', () => {
  let apiClientRegular: ApiClient;
  let authTokenRegular: string;
  let apiClientAdmin: ApiClient;
  let authTokenAdmin: string;

  TestDecorators.setupTestDescribe({
    suite: 'Cart Management API Tests',
    suiteDescription: 'Tests for the DELETE /api/Cart endpoint with regular user authentication',
    epic: 'Cart Management',
    feature: 'Clear Cart'
  });

  test.beforeEach(async ({ browser }) => {
    let apiRequestContextRegular = (await browser.newContext()).request;
    apiClientRegular = new ApiClient(apiRequestContextRegular);

    // Login as regular user to get authentication token
    const loginResponse = await apiClientRegular.post(LittleBugShop().Controllers.Users.login, {
      data: {
        username: 'User',
        password: 'qazwsxedcrfv12345'
      }
    });

    expect(loginResponse.status(), 'Regular user login should return 200 status').toBe(200);
    const loginResult = await ResponseValidator.getResponseBody<{ token: string }>(loginResponse);
    authTokenRegular = loginResult.token;

    let apiRequestContextAdmin = (await browser.newContext()).request;
    apiClientAdmin = new ApiClient(apiRequestContextAdmin);

    // Login as admin user to get authentication token
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

  test('TC 001P Validate successful clearing cart with items', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful cart clearing when cart contains items',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let productData: Product;
    let cartItemData: AddCartItemRequest;
    let productId: number;
    let response: any;
    let result: any;

    await test.step('Create product as admin', async () => {
      productData = ProductFactory.generateProduct();
      response = await apiClientAdmin.post(LittleBugShop().Controllers.Products.create, {
        data: productData,
        headers: {
          Authorization: `Bearer ${authTokenAdmin}`
        }
      });
      expect(response.status(), 'Product creation by admin should return 201 status').toBe(201);
      productId = (await ResponseValidator.getResponseBody<{ id: number }>(response)).id;
    });

    await test.step('Add item to cart', async () => {
      cartItemData = CartFactory.generateCartItemWithProductId(productId);
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Adding item to cart should succeed').toBeGreaterThanOrEqual(200);
      expect(response.status(), 'Adding item to cart should return success code').toBeLessThan(300);
    });

    await test.step('Verify cart has items before deletion', async () => {
      response = await apiClientRegular.get(LittleBugShop().Controllers.Cart.get, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Get cart should return 200 status').toBe(200);
      result = await ResponseValidator.getResponseBody(response);
      expect(result.items, 'Cart should contain items before clearing').toBeDefined();
      expect(result.items.length, 'Cart should have at least 1 item before clearing').toBeGreaterThan(0);
    });

    await test.step('Send delete cart request', async () => {
      response = await apiClientRegular.delete(LittleBugShop().Controllers.Cart.delete, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status(), 'Clearing cart should return 200 or 204 status').toBeGreaterThanOrEqual(200);
      expect(response.status(), 'Clearing cart should return success code').toBeLessThan(300);
    });

    await test.step('Verify cart is empty after deletion', async () => {
      response = await apiClientRegular.get(LittleBugShop().Controllers.Cart.get, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Get cart should return 200 status').toBe(200);
      result = await ResponseValidator.getResponseBody(response);
      expect(result.items, 'Cart items should be defined after clearing').toBeDefined();
      expect(result.items.length, 'Cart should be empty after clearing').toBe(0);
    });
  });

  test('TC 002P Validate clearing already empty cart', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful cart clearing when cart is already empty',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let response: any;
    let result: any;

    await test.step('Verify cart is empty before deletion', async () => {
      response = await apiClientRegular.get(LittleBugShop().Controllers.Cart.get, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Get cart should return 200 status').toBe(200);
      result = await ResponseValidator.getResponseBody(response);
      
      // Clear cart if it has items
      if (result.items && result.items.length > 0) {
        await apiClientRegular.delete(LittleBugShop().Controllers.Cart.delete, {
          headers: {
            Authorization: `Bearer ${authTokenRegular}`
          }
        });
      }
    });

    await test.step('Send delete cart request on empty cart', async () => {
      response = await apiClientRegular.delete(LittleBugShop().Controllers.Cart.delete, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status(), 'Clearing empty cart should return success status').toBeGreaterThanOrEqual(200);
      expect(response.status(), 'Clearing empty cart should not be an error').toBeLessThan(300);
    });

    await test.step('Verify cart remains empty', async () => {
      response = await apiClientRegular.get(LittleBugShop().Controllers.Cart.get, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Get cart should return 200 status').toBe(200);
      result = await ResponseValidator.getResponseBody(response);
      expect(result.items, 'Cart items should be defined').toBeDefined();
      expect(result.items.length, 'Cart should remain empty').toBe(0);
    });
  });

  test('TC 003P Validate clearing cart with multiple items', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful cart clearing when cart contains multiple items',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let productData1: Product;
    let productData2: Product;
    let productData3: Product;
    let cartItemData: AddCartItemRequest;
    let productId1: number;
    let productId2: number;
    let productId3: number;
    let response: any;
    let result: any;

    await test.step('Create multiple products as admin', async () => {
      // Create product 1
      productData1 = ProductFactory.generateProduct();
      response = await apiClientAdmin.post(LittleBugShop().Controllers.Products.create, {
        data: productData1,
        headers: {
          Authorization: `Bearer ${authTokenAdmin}`
        }
      });
      expect(response.status(), 'Product 1 creation should return 201 status').toBe(201);
      productId1 = (await ResponseValidator.getResponseBody<{ id: number }>(response)).id;

      // Create product 2
      productData2 = ProductFactory.generateProduct();
      response = await apiClientAdmin.post(LittleBugShop().Controllers.Products.create, {
        data: productData2,
        headers: {
          Authorization: `Bearer ${authTokenAdmin}`
        }
      });
      expect(response.status(), 'Product 2 creation should return 201 status').toBe(201);
      productId2 = (await ResponseValidator.getResponseBody<{ id: number }>(response)).id;

      // Create product 3
      productData3 = ProductFactory.generateProduct();
      response = await apiClientAdmin.post(LittleBugShop().Controllers.Products.create, {
        data: productData3,
        headers: {
          Authorization: `Bearer ${authTokenAdmin}`
        }
      });
      expect(response.status(), 'Product 3 creation should return 201 status').toBe(201);
      productId3 = (await ResponseValidator.getResponseBody<{ id: number }>(response)).id;
    });

    await test.step('Add multiple items to cart', async () => {
      // Add item 1
      cartItemData = CartFactory.generateCartItemWithProductId(productId1);
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Adding item 1 should succeed').toBeGreaterThanOrEqual(200);

      // Add item 2
      cartItemData = CartFactory.generateCartItemWithProductId(productId2);
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Adding item 2 should succeed').toBeGreaterThanOrEqual(200);

      // Add item 3
      cartItemData = CartFactory.generateCartItemWithProductId(productId3);
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Adding item 3 should succeed').toBeGreaterThanOrEqual(200);
    });

    await test.step('Verify cart has 3 items before deletion', async () => {
      response = await apiClientRegular.get(LittleBugShop().Controllers.Cart.get, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Get cart should return 200 status').toBe(200);
      result = await ResponseValidator.getResponseBody(response);
      expect(result.items, 'Cart should contain items before clearing').toBeDefined();
      expect(result.items.length, 'Cart should have 3 items before clearing').toBe(3);
    });

    await test.step('Send delete cart request', async () => {
      response = await apiClientRegular.delete(LittleBugShop().Controllers.Cart.delete, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status(), 'Clearing cart should return success status').toBeGreaterThanOrEqual(200);
      expect(response.status(), 'Clearing cart should return success code').toBeLessThan(300);
    });

    await test.step('Verify cart is empty after deletion', async () => {
      response = await apiClientRegular.get(LittleBugShop().Controllers.Cart.get, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Get cart should return 200 status').toBe(200);
      result = await ResponseValidator.getResponseBody(response);
      expect(result.items, 'Cart items should be defined after clearing').toBeDefined();
      expect(result.items.length, 'Cart should be empty after clearing all 3 items').toBe(0);
    });
  });
});
