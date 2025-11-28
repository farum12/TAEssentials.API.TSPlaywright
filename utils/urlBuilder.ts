import { config } from '../config/api.config';

class UsersEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/Users`;
  }

  register(): string {
    return `${this.basePath}/register`;
  }

  login(): string {
    return `${this.basePath}/login`;
  }

  logout(): string {
    return `${this.basePath}/logout`;
  }

  getById(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  admin = {
    users: (): string => {
      return `${this.basePath}/admin/users`;
    },
    getUserById: (id: string | number): string => {
      return `${this.basePath}/admin/users/${id}`;
    },
    updateUser: (id: string | number): string => {
      return `${this.basePath}/admin/users/${id}`;
    },
    resetPassword: (id: string | number): string => {
      return `${this.basePath}/admin/users/${id}/reset-password`;
    },
  };
}

class ProductsEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/Products`;
  }

  list(): string {
    return this.basePath;
  }

  create(): string {
    return this.basePath;
  }

  getById(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  update(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  delete(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  availability(id: string | number): string {
    return `${this.basePath}/${id}/availability`;
  }

  stock(id: string | number): string {
    return `${this.basePath}/${id}/stock`;
  }

  increaseStock(id: string | number): string {
    return `${this.basePath}/${id}/stock/increase`;
  }

  decreaseStock(id: string | number): string {
    return `${this.basePath}/${id}/stock/decrease`;
  }
}

class CartEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/Cart`;
  }

  get(): string {
    return this.basePath;
  }

  clear(): string {
    return this.basePath;
  }

  addItem(): string {
    return `${this.basePath}/items`;
  }

  updateItem(itemId: string | number): string {
    return `${this.basePath}/items/${itemId}`;
  }

  removeItem(itemId: string | number): string {
    return `${this.basePath}/items/${itemId}`;
  }

  checkout(): string {
    return `${this.basePath}/checkout`;
  }

  applyCoupon(): string {
    return `${this.basePath}/apply-coupon`;
  }

  removeCoupon(): string {
    return `${this.basePath}/remove-coupon`;
  }
}

class OrdersEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/Orders`;
  }

  create(): string {
    return `${this.basePath}/create`;
  }

  place(): string {
    return `${this.basePath}/place`;
  }

  list(): string {
    return this.basePath;
  }

  myOrders(): string {
    return `${this.basePath}/my-orders`;
  }

  getById(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  delete(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  updateStatus(id: string | number): string {
    return `${this.basePath}/${id}/status`;
  }

  pending(): string {
    return `${this.basePath}/pending`;
  }

  cancel(id: string | number): string {
    return `${this.basePath}/${id}/cancel`;
  }
}

class ProfileEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/users/profile`;
  }

  get(): string {
    return this.basePath;
  }

  update(): string {
    return this.basePath;
  }

  addresses = {
    add: (): string => {
      return `${this.basePath}/addresses`;
    },
    update: (id: string | number): string => {
      return `${this.basePath}/addresses/${id}`;
    },
    delete: (id: string | number): string => {
      return `${this.basePath}/addresses/${id}`;
    },
    setDefault: (id: string | number): string => {
      return `${this.basePath}/addresses/${id}/set-default`;
    },
  };

  changePassword(): string {
    return `${this.basePath}/change-password`;
  }
}

class ReviewsEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  create(productId: string | number): string {
    return `${this.basePath}/products/${productId}/Reviews`;
  }

  list(productId: string | number): string {
    return `${this.basePath}/products/${productId}/Reviews`;
  }

  getById(productId: string | number, reviewId: string | number): string {
    return `${this.basePath}/products/${productId}/Reviews/${reviewId}`;
  }

  delete(productId: string | number, reviewId: string | number): string {
    return `${this.basePath}/products/${productId}/Reviews/${reviewId}`;
  }

  myReview(productId: string | number): string {
    return `${this.basePath}/products/${productId}/my-review`;
  }

  markHelpful(reviewId: string | number): string {
    return `${this.basePath}/reviews/${reviewId}/helpful`;
  }

  moderate(productId: string | number, reviewId: string | number): string {
    return `${this.basePath}/products/${productId}/Reviews/${reviewId}/moderate`;
  }

  admin = {
    list: (): string => {
      return `${this.basePath}/admin/reviews`;
    },
  };
}

class WishlistEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/Wishlist`;
  }

  get(): string {
    return this.basePath;
  }

  clear(): string {
    return this.basePath;
  }

  addItem(productId: string | number): string {
    return `${this.basePath}/items/${productId}`;
  }

  removeItem(productId: string | number): string {
    return `${this.basePath}/items/${productId}`;
  }

  checkItem(productId: string | number): string {
    return `${this.basePath}/check/${productId}`;
  }

  moveToCart(): string {
    return `${this.basePath}/move-to-cart`;
  }

  count(): string {
    return `${this.basePath}/count`;
  }
}

class PaymentMethodsEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/payment-methods`;
  }

  list(): string {
    return this.basePath;
  }

  add(): string {
    return this.basePath;
  }

  getById(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  update(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  delete(id: string | number): string {
    return `${this.basePath}/${id}`;
  }

  setDefault(id: string | number): string {
    return `${this.basePath}/${id}/set-default`;
  }
}

class PaymentsEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/payments`;
  }

  process(): string {
    return `${this.basePath}/process`;
  }

  transactions(): string {
    return `${this.basePath}/transactions`;
  }

  getTransaction(id: string | number): string {
    return `${this.basePath}/transactions/${id}`;
  }

  refund(): string {
    return `${this.basePath}/refund`;
  }

  admin = {
    transactions: (): string => {
      return `${this.basePath}/admin/transactions`;
    },
    statistics: (): string => {
      return `${this.basePath}/admin/statistics`;
    },
  };
}

class CouponsEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/Coupons`;
  }

  validate(code: string): string {
    return `${this.basePath}/validate/${code}`;
  }

  admin = {
    list: (): string => {
      return `${this.basePath}/admin/coupons`;
    },
    create: (): string => {
      return `${this.basePath}/admin/coupons`;
    },
    update: (id: string | number): string => {
      return `${this.basePath}/admin/coupons/${id}`;
    },
    delete: (id: string | number): string => {
      return `${this.basePath}/admin/coupons/${id}`;
    },
    usage: (id: string | number): string => {
      return `${this.basePath}/admin/coupons/${id}/usage`;
    },
  };
}

class SessionEndpoints {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = `${basePath}/Session`;
  }

  get(): string {
    return this.basePath;
  }
}

class UrlBuilder {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.baseUrl;
  }

  get Users(): UsersEndpoints {
    return new UsersEndpoints(`${this.baseUrl}/api`);
  }

  get Products(): ProductsEndpoints {
    return new ProductsEndpoints(`${this.baseUrl}/api`);
  }

  get Cart(): CartEndpoints {
    return new CartEndpoints(`${this.baseUrl}/api`);
  }

  get Orders(): OrdersEndpoints {
    return new OrdersEndpoints(`${this.baseUrl}/api`);
  }

  get Profile(): ProfileEndpoints {
    return new ProfileEndpoints(`${this.baseUrl}/api`);
  }

  get Reviews(): ReviewsEndpoints {
    return new ReviewsEndpoints(`${this.baseUrl}/api`);
  }

  get Wishlist(): WishlistEndpoints {
    return new WishlistEndpoints(`${this.baseUrl}/api`);
  }

  get PaymentMethods(): PaymentMethodsEndpoints {
    return new PaymentMethodsEndpoints(`${this.baseUrl}/api`);
  }

  get Payments(): PaymentsEndpoints {
    return new PaymentsEndpoints(`${this.baseUrl}/api`);
  }

  get Coupons(): CouponsEndpoints {
    return new CouponsEndpoints(`${this.baseUrl}/api`);
  }

  get Session(): SessionEndpoints {
    return new SessionEndpoints(`${this.baseUrl}/api`);
  }
}

/**
 * Creates a new URL builder instance for LittleBugShop API
 * @param baseUrl Optional base URL, defaults to configured base URL
 * @returns UrlBuilder instance
 * 
 * @example
 * // Using default base URL
 * const url = LittleBugShop().Users.register();
 * // Returns: "http://localhost:5052/api/Users/register"
 * 
 * @example
 * // Using custom base URL
 * const url = LittleBugShop('https://production.com').Users.login();
 * // Returns: "https://production.com/api/Users/login"
 * 
 * @example
 * // With ID parameters
 * const url = LittleBugShop().Users.getById(123);
 * // Returns: "http://localhost:5052/api/Users/123"
 */
export function LittleBugShop(baseUrl?: string): UrlBuilder {
  return new UrlBuilder(baseUrl);
}

// Export for direct access if needed
export { UrlBuilder };
