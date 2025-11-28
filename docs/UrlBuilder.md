# URL Builder Guide

The URL Builder provides a fluent, type-safe API for constructing LittleBugShop endpoint URLs.

## Basic Usage

```typescript
import { LittleBugShop } from '../utils/urlBuilder';

// Simple endpoint
const registerUrl = LittleBugShop().Users.register();
// Returns: "http://localhost:5052/api/Users/register"

// Endpoint with ID parameter
const userUrl = LittleBugShop().Users.getById(123);
// Returns: "http://localhost:5052/api/Users/123"

// Custom base URL
const prodUrl = LittleBugShop('https://production.com').Users.login();
// Returns: "https://production.com/api/Users/login"
```

## API Reference

### Users

```typescript
LittleBugShop().Users.register()              // POST /api/Users/register
LittleBugShop().Users.login()                 // POST /api/Users/login
LittleBugShop().Users.logout()                // POST /api/Users/logout
LittleBugShop().Users.getById(123)            // GET /api/Users/123

// Admin endpoints
LittleBugShop().Users.admin.users()           // GET /api/Users/admin/users
LittleBugShop().Users.admin.getUserById(123)  // GET /api/Users/admin/users/123
LittleBugShop().Users.admin.updateUser(123)   // PUT /api/Users/admin/users/123
LittleBugShop().Users.admin.resetPassword(123) // POST /api/Users/admin/users/123/reset-password
```

### Products

```typescript
LittleBugShop().Products.list()               // GET /api/Products
LittleBugShop().Products.create()             // POST /api/Products
LittleBugShop().Products.getById(456)         // GET /api/Products/456
LittleBugShop().Products.update(456)          // PUT /api/Products/456
LittleBugShop().Products.delete(456)          // DELETE /api/Products/456
LittleBugShop().Products.availability(456)    // GET /api/Products/456/availability
LittleBugShop().Products.stock(456)           // PUT /api/Products/456/stock
LittleBugShop().Products.increaseStock(456)   // POST /api/Products/456/stock/increase
LittleBugShop().Products.decreaseStock(456)   // POST /api/Products/456/stock/decrease
```

### Cart

```typescript
LittleBugShop().Cart.get()                    // GET /api/Cart
LittleBugShop().Cart.clear()                  // DELETE /api/Cart
LittleBugShop().Cart.addItem()                // POST /api/Cart/items
LittleBugShop().Cart.updateItem(789)          // PUT /api/Cart/items/789
LittleBugShop().Cart.removeItem(789)          // DELETE /api/Cart/items/789
LittleBugShop().Cart.checkout()               // POST /api/Cart/checkout
LittleBugShop().Cart.applyCoupon()            // POST /api/Cart/apply-coupon
LittleBugShop().Cart.removeCoupon()           // DELETE /api/Cart/remove-coupon
```

### Orders

```typescript
LittleBugShop().Orders.create()               // POST /api/Orders/create
LittleBugShop().Orders.place()                // POST /api/Orders/place
LittleBugShop().Orders.list()                 // GET /api/Orders
LittleBugShop().Orders.myOrders()             // GET /api/Orders/my-orders
LittleBugShop().Orders.getById(101)           // GET /api/Orders/101
LittleBugShop().Orders.delete(101)            // DELETE /api/Orders/101
LittleBugShop().Orders.updateStatus(101)      // PUT /api/Orders/101/status
LittleBugShop().Orders.pending()              // GET /api/Orders/pending
LittleBugShop().Orders.cancel(101)            // DELETE /api/Orders/101/cancel
```

### Profile

```typescript
LittleBugShop().Profile.get()                 // GET /api/users/profile
LittleBugShop().Profile.update()              // PUT /api/users/profile
LittleBugShop().Profile.changePassword()      // PUT /api/users/profile/change-password

// Address management
LittleBugShop().Profile.addresses.add()       // POST /api/users/profile/addresses
LittleBugShop().Profile.addresses.update(5)   // PUT /api/users/profile/addresses/5
LittleBugShop().Profile.addresses.delete(5)   // DELETE /api/users/profile/addresses/5
LittleBugShop().Profile.addresses.setDefault(5) // PUT /api/users/profile/addresses/5/set-default
```

### Reviews

```typescript
LittleBugShop().Reviews.create(productId)                    // POST /api/products/{productId}/Reviews
LittleBugShop().Reviews.list(productId)                      // GET /api/products/{productId}/Reviews
LittleBugShop().Reviews.getById(productId, reviewId)         // GET /api/products/{productId}/Reviews/{reviewId}
LittleBugShop().Reviews.delete(productId, reviewId)          // DELETE /api/products/{productId}/Reviews/{reviewId}
LittleBugShop().Reviews.myReview(productId)                  // GET /api/products/{productId}/my-review
LittleBugShop().Reviews.markHelpful(reviewId)                // POST /api/reviews/{reviewId}/helpful
LittleBugShop().Reviews.moderate(productId, reviewId)        // PUT /api/products/{productId}/Reviews/{reviewId}/moderate
LittleBugShop().Reviews.admin.list()                         // GET /api/admin/reviews
```

### Wishlist

```typescript
LittleBugShop().Wishlist.get()                // GET /api/Wishlist
LittleBugShop().Wishlist.clear()              // DELETE /api/Wishlist
LittleBugShop().Wishlist.addItem(productId)   // POST /api/Wishlist/items/{productId}
LittleBugShop().Wishlist.removeItem(productId) // DELETE /api/Wishlist/items/{productId}
LittleBugShop().Wishlist.checkItem(productId) // GET /api/Wishlist/check/{productId}
LittleBugShop().Wishlist.moveToCart()         // POST /api/Wishlist/move-to-cart
LittleBugShop().Wishlist.count()              // GET /api/Wishlist/count
```

### Payment Methods

```typescript
LittleBugShop().PaymentMethods.list()         // GET /api/payment-methods
LittleBugShop().PaymentMethods.add()          // POST /api/payment-methods
LittleBugShop().PaymentMethods.getById(10)    // GET /api/payment-methods/10
LittleBugShop().PaymentMethods.update(10)     // PUT /api/payment-methods/10
LittleBugShop().PaymentMethods.delete(10)     // DELETE /api/payment-methods/10
LittleBugShop().PaymentMethods.setDefault(10) // PUT /api/payment-methods/10/set-default
```

### Payments

```typescript
LittleBugShop().Payments.process()            // POST /api/payments/process
LittleBugShop().Payments.transactions()       // GET /api/payments/transactions
LittleBugShop().Payments.getTransaction(20)   // GET /api/payments/transactions/20
LittleBugShop().Payments.refund()             // POST /api/payments/refund

// Admin endpoints
LittleBugShop().Payments.admin.transactions() // GET /api/payments/admin/transactions
LittleBugShop().Payments.admin.statistics()   // GET /api/payments/admin/statistics
```

### Coupons

```typescript
LittleBugShop().Coupons.validate('CODE123')   // GET /api/Coupons/validate/CODE123

// Admin endpoints
LittleBugShop().Coupons.admin.list()          // GET /api/Coupons/admin/coupons
LittleBugShop().Coupons.admin.create()        // POST /api/Coupons/admin/coupons
LittleBugShop().Coupons.admin.update(30)      // PUT /api/Coupons/admin/coupons/30
LittleBugShop().Coupons.admin.delete(30)      // DELETE /api/Coupons/admin/coupons/30
LittleBugShop().Coupons.admin.usage(30)       // GET /api/Coupons/admin/coupons/30/usage
```

### Session

```typescript
LittleBugShop().Session.get()                 // GET /api/Session
```

## Usage in Tests

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { LittleBugShop } from '../../utils/urlBuilder';
import { UserFactory } from '../../utils/userFactory';

test('should register a new user', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const userData = UserFactory.generateUser();
  
  const response = await apiClient.post(
    LittleBugShop().Users.register(),
    { data: userData }
  );
  
  expect(response.status()).toBe(200);
});

test('should get user by ID', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const userId = 123;
  
  const response = await apiClient.get(
    LittleBugShop().Users.getById(userId)
  );
  
  expect(response.status()).toBe(200);
});
```

## Benefits

1. **Type Safety** - Catch errors at compile time
2. **Autocomplete** - IntelliSense support in your IDE
3. **Maintainability** - Centralized URL management
4. **Readability** - Clear, self-documenting code
5. **Flexibility** - Easy to switch environments

## Environment-Specific URLs

```typescript
// Development
const devUrl = LittleBugShop('http://localhost:5052').Users.register();

// Staging
const stagingUrl = LittleBugShop('https://staging.littlebugshop.com').Users.register();

// Production
const prodUrl = LittleBugShop('https://littlebugshop.com').Users.register();

// Or use from config
import { config } from '../config/api.config';
const url = LittleBugShop(config.baseUrl).Users.register();
```
