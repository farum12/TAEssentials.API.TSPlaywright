import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { LittleBugShop } from '../../utils/urlBuilder';

/**
 * URL Builder Examples
 * 
 * This file demonstrates various ways to use the URL Builder
 * for constructing API endpoints in tests.
 */

test.describe('URL Builder Examples', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test.skip('Example: Users endpoints', async () => {
    // Registration
    const registerUrl = LittleBugShop().Users.register();
    console.log('Register URL:', registerUrl);
    // Output: http://localhost:5052/api/Users/register

    // Login
    const loginUrl = LittleBugShop().Users.login();
    console.log('Login URL:', loginUrl);
    // Output: http://localhost:5052/api/Users/login

    // Get user by ID
    const userUrl = LittleBugShop().Users.getById(123);
    console.log('User by ID URL:', userUrl);
    // Output: http://localhost:5052/api/Users/123

    // Admin endpoints
    const adminUsersUrl = LittleBugShop().Users.admin.users();
    console.log('Admin Users URL:', adminUsersUrl);
    // Output: http://localhost:5052/api/Users/admin/users
  });

  test.skip('Example: Products endpoints', async () => {
    // List products
    const listUrl = LittleBugShop().Products.list();
    console.log('Products List URL:', listUrl);

    // Get product by ID
    const productUrl = LittleBugShop().Products.getById(456);
    console.log('Product by ID URL:', productUrl);

    // Check availability
    const availabilityUrl = LittleBugShop().Products.availability(456);
    console.log('Product Availability URL:', availabilityUrl);
  });

  test.skip('Example: Cart endpoints', async () => {
    // Get cart
    const cartUrl = LittleBugShop().Cart.get();
    console.log('Get Cart URL:', cartUrl);

    // Add item to cart
    const addItemUrl = LittleBugShop().Cart.addItem();
    console.log('Add to Cart URL:', addItemUrl);

    // Checkout
    const checkoutUrl = LittleBugShop().Cart.checkout();
    console.log('Checkout URL:', checkoutUrl);
  });

  test.skip('Example: Using in actual API calls', async () => {
    // Example: Get session
    const response = await apiClient.get(LittleBugShop().Session.get());
    console.log('Session response status:', response.status());

    // Example: Get products list
    const productsResponse = await apiClient.get(LittleBugShop().Products.list());
    console.log('Products response status:', productsResponse.status());
  });

  test.skip('Example: Custom base URL', async () => {
    // Use a different environment
    const stagingUrl = LittleBugShop('https://staging.littlebugshop.com').Users.login();
    console.log('Staging Login URL:', stagingUrl);
    // Output: https://staging.littlebugshop.com/api/Users/login

    const prodUrl = LittleBugShop('https://littlebugshop.com').Products.getById(789);
    console.log('Production Product URL:', prodUrl);
    // Output: https://littlebugshop.com/api/Products/789
  });

  test.skip('Example: All endpoint categories', async () => {
    const examples = {
      users: LittleBugShop().Users.register(),
      products: LittleBugShop().Products.list(),
      cart: LittleBugShop().Cart.get(),
      orders: LittleBugShop().Orders.myOrders(),
      profile: LittleBugShop().Profile.get(),
      reviews: LittleBugShop().Reviews.list(123),
      wishlist: LittleBugShop().Wishlist.get(),
      paymentMethods: LittleBugShop().PaymentMethods.list(),
      payments: LittleBugShop().Payments.transactions(),
      coupons: LittleBugShop().Coupons.validate('CODE123'),
      session: LittleBugShop().Session.get(),
    };

    console.log('All endpoint examples:', JSON.stringify(examples, null, 2));
  });
});
