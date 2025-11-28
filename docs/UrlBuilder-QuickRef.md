# URL Builder - Quick Reference

## Import
```typescript
import { LittleBugShop } from '../utils/urlBuilder';
```

## Common Patterns

### Users
```typescript
LittleBugShop().Users.register()
LittleBugShop().Users.login()
LittleBugShop().Users.logout()
LittleBugShop().Users.getById(id)
```

### Products
```typescript
LittleBugShop().Products.list()
LittleBugShop().Products.getById(id)
LittleBugShop().Products.create()
LittleBugShop().Products.update(id)
LittleBugShop().Products.delete(id)
```

### Shopping
```typescript
// Cart
LittleBugShop().Cart.get()
LittleBugShop().Cart.addItem()
LittleBugShop().Cart.checkout()

// Wishlist
LittleBugShop().Wishlist.get()
LittleBugShop().Wishlist.addItem(productId)

// Orders
LittleBugShop().Orders.myOrders()
LittleBugShop().Orders.getById(id)
```

### Profile
```typescript
LittleBugShop().Profile.get()
LittleBugShop().Profile.update()
LittleBugShop().Profile.changePassword()
LittleBugShop().Profile.addresses.add()
```

### Admin
```typescript
LittleBugShop().Users.admin.users()
LittleBugShop().Coupons.admin.create()
LittleBugShop().Payments.admin.transactions()
```

## Test Examples

```typescript
// Simple GET
const response = await apiClient.get(
  LittleBugShop().Products.getById(123)
);

// POST with data
const response = await apiClient.post(
  LittleBugShop().Users.register(),
  { data: userData }
);

// PUT with ID
const response = await apiClient.put(
  LittleBugShop().Products.update(456),
  { data: productData }
);

// DELETE
const response = await apiClient.delete(
  LittleBugShop().Cart.removeItem(789)
);
```

## Environment Switching

```typescript
// Local (default from config)
LittleBugShop().Users.login()

// Custom environment
LittleBugShop('https://staging.com').Users.login()
LittleBugShop('https://production.com').Users.login()
```

## All Available Endpoints

| Category | Methods |
|----------|---------|
| **Users** | register, login, logout, getById, admin.* |
| **Products** | list, create, getById, update, delete, availability, stock, increaseStock, decreaseStock |
| **Cart** | get, clear, addItem, updateItem, removeItem, checkout, applyCoupon, removeCoupon |
| **Orders** | create, place, list, myOrders, getById, delete, updateStatus, pending, cancel |
| **Profile** | get, update, changePassword, addresses.* |
| **Reviews** | create, list, getById, delete, myReview, markHelpful, moderate, admin.* |
| **Wishlist** | get, clear, addItem, removeItem, checkItem, moveToCart, count |
| **PaymentMethods** | list, add, getById, update, delete, setDefault |
| **Payments** | process, transactions, getTransaction, refund, admin.* |
| **Coupons** | validate, admin.* |
| **Session** | get |

See [Full Documentation](UrlBuilder.md) for detailed information.
