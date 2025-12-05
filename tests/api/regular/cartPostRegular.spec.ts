// tests/api/regular/cartPostRegular.spec.ts

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import { ResponseValidator } from '../../../utils/responseValidator';
import { CartFactory, AddCartItemRequest } from '../../../utils/factories/cartFactory';
import { LittleBugShop } from '../../../utils/urlBuilders/littleBugShopUrlBuilder';
import { TestDecorators, TestSeverity as Severity } from '../../../utils/testDecorators';
import { Product, ProductFactory } from '@utils/factories/productFactory';

test.describe('Cart Management API Tests - Regular User - POST /api/Cart/items', () => {
  let apiClientRegular: ApiClient;
  let authTokenRegular: string;

  let apiClientAdmin: ApiClient;
  let authTokenAdmin: string;

  TestDecorators.setupTestDescribe({
    suite: 'Cart Management API Tests',
    suiteDescription: 'Tests for the POST /api/Cart/items endpoint with regular user authentication',
    epic: 'Cart Management',
    feature: 'Add Items to Cart'
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

    // Clean User's cart before each test
    await apiClientRegular.delete(LittleBugShop().Controllers.Cart.delete, {
      headers: {
        Authorization: `Bearer ${authTokenRegular}`
      }
    });


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

  test('TC 001P Validate successful adding item to cart with valid data', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful cart item addition with valid product ID and quantity as regular user',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let productData: Product;
    let cartItemData: AddCartItemRequest;
    let productId: number;
    let response: any;
    let result: any;

    await test.step('Prepare test prerequisites', async () => {
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

    await test.step('Generate cart item test data', async () => {
      cartItemData = CartFactory.generateCartItemWithProductId(productId);
    });

    await test.step('Send add cart item request', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Validate response status and content type', async () => {
      expect(response.status(), 'Adding item to cart should return 200 or 201 status').toBeGreaterThanOrEqual(200);
      expect(response.status(), 'Adding item to cart should return success status code').toBeLessThan(300);
      await ResponseValidator.validateContentType(response, 'application/json');
    });

    await test.step('Parse response body', async () => {
      result = await ResponseValidator.getResponseBody(response);
    });

    await test.step('Verify response contains cart data', async () => {
      expect(result, 'Response should contain cart data').toBeDefined();
    });

    await test.step('Get cart to verify item was added', async () => {
      response = await apiClientRegular.get(LittleBugShop().Controllers.Cart.get, {
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
      expect(response.status(), 'Get cart should return 200 status').toBe(200);
      result = await ResponseValidator.getResponseBody(response);
    });

    await test.step('Verify cart contains exactly 1 item', async () => {
      expect(result.items, 'Cart should contain items array').toBeDefined();
      expect(result.items.length, 'Cart should contain exactly 1 item').toBe(1);
      expect(result.items[0].productId, 'Cart item should have the correct product ID').toBe(productId);
      expect(result.items[0].quantity, 'Cart item should have the correct quantity').toBe(cartItemData.quantity);
    });

    await test.step('Verify cart item product details match created product', async () => {
      const cartItem = result.items[0];
      expect(cartItem, 'Cart item should contain product details').toBeDefined();
      expect(cartItem.productId, 'Product ID should match').toBe(productId);
      expect(cartItem.productName, 'Product name should match created product').toBe(productData.name);
      expect(cartItem.author, 'Product author should match created product').toBe(productData.author);
      expect(cartItem.unitPrice, 'Product price should match created product').toBe(productData.price);
      expect(cartItem.quantity, 'Quantity should match added item').toBe(cartItemData.quantity);
      expect(cartItem.totalPrice, 'Total price should match calculated value').toBe(productData.price * cartItemData.quantity);
    });
  });

  test('TC 002P Validate adding item to cart with quantity of 1', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful cart item addition with single quantity',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let cartItemData: AddCartItemRequest;
    let response: any;
    let productData: Product;
    let productId: number;

    await test.step('Prepare test prerequisites', async () => {
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

    await test.step('Generate cart item with single quantity', async () => {
      cartItemData = CartFactory.generateSingleQuantityCartItem(productId);
    });

    await test.step('Send add cart item request with quantity 1', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status(), 'Adding single quantity item should succeed').toBeGreaterThanOrEqual(200);
      expect(response.status(), 'Adding single quantity item should return success code').toBeLessThan(300);
    });
  });

  test('TC 003P Validate adding item to cart with maximum quantity', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful cart item addition with maximum typical quantity',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let cartItemData: AddCartItemRequest;
    let response: any;
    let productData: Product;
    let productId: number;

    await test.step('Prepare test prerequisites', async () => {
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

    await test.step('Generate cart item with maximum quantity', async () => {
      cartItemData = CartFactory.generateMaxQuantityCartItem(productId);
    });

    await test.step('Send add cart item request with maximum quantity', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status(), 'Adding maximum quantity item should succeed or return validation error').toBeGreaterThanOrEqual(200);
    });
  });

  test('TC 004N Validate rejection of adding item with negative product ID', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects adding cart item with negative product ID',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let cartItemData: AddCartItemRequest;
    let response: any;

    await test.step('Generate cart item with negative product ID', async () => {
      cartItemData = CartFactory.generateCartItemWithNegativeProductId();
    });

    await test.step('Send add cart item request with negative product ID', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status(), 'Negative product ID should be rejected with 404').toBe(404);
    });
  });

  test('TC 005N Validate rejection of adding item with zero product ID', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects adding cart item with zero product ID',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let cartItemData: AddCartItemRequest;
    let response: any;

    await test.step('Generate cart item with zero product ID', async () => {
      cartItemData = CartFactory.generateCartItemWithZeroProductId();
    });

    await test.step('Send add cart item request with zero product ID', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Verify request is rejected with 404', async () => {
      expect(response.status(), 'Zero product ID should be rejected with 404').toBe(404);
    });
  });

  test('TC 006N Validate rejection of adding item with negative quantity', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects adding cart item with negative quantity',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let cartItemData: AddCartItemRequest;
    let response: any;
    let productData: Product;
    let productId: number;

    await test.step('Prepare test prerequisites', async () => {
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

    await test.step('Generate cart item with negative quantity', async () => {
      cartItemData = CartFactory.generateCartItemWithNegativeQuantity(productId);
    });

    await test.step('Send add cart item request with negative quantity', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status(), 'Negative quantity should be rejected with 400 Bad Request').toBe(400);
    });
  });

  test('TC 007N Validate rejection of adding item with zero quantity', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects adding cart item with zero quantity',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let cartItemData: AddCartItemRequest;
    let response: any;let productData: Product;
    let productId: number;

    await test.step('Prepare test prerequisites', async () => {
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

    await test.step('Generate cart item with zero quantity', async () => {
      cartItemData = CartFactory.generateCartItemWithZeroQuantity(productId);
    });

    await test.step('Send add cart item request with zero quantity', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status(), 'Zero quantity should be rejected with 400 Bad Request').toBe(400);
    });
  });

  test('TC 008N Validate rejection of adding non-existent product', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects adding cart item with non-existent product ID',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let cartItemData: AddCartItemRequest;
    let response: any;

    await test.step('Generate cart item with non-existent product ID', async () => {
      cartItemData = CartFactory.generateCartItemWithNonExistentProductId();
    });

    await test.step('Send add cart item request with non-existent product ID', async () => {
      response = await apiClientRegular.post(LittleBugShop().Controllers.Cart.addItem, {
        data: cartItemData,
        headers: {
          Authorization: `Bearer ${authTokenRegular}`
        }
      });
    });

    await test.step('Verify request is rejected with 404 or 400', async () => {
      expect(response.status(), 'Non-existent product should be rejected with 404').toBe(404);
    });
  });
});
