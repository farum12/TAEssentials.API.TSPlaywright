import { faker } from '@faker-js/faker';

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export class CartFactory {
  /**
   * Generate a valid cart item with valid product ID and quantity
   */
  static generateCartItem(overrides?: Partial<AddCartItemRequest>): AddCartItemRequest {
    return {
      productId: faker.number.int({ min: 1, max: 1000 }),
      quantity: faker.number.int({ min: 1, max: 10 }),
      ...overrides,
    };
  }

  /**
   * Generate a cart item with a specific product ID
   */
  static generateCartItemWithProductId(productId: number): AddCartItemRequest {
    return this.generateCartItem({ productId });
  }

  /**
   * Generate a cart item with a specific quantity
   */
  static generateCartItemWithQuantity(quantity: number): AddCartItemRequest {
    return this.generateCartItem({ quantity });
  }

  /**
   * Generate a cart item with negative product ID (for validation testing)
   */
  static generateCartItemWithNegativeProductId(): AddCartItemRequest {
    return this.generateCartItem({
      productId: -faker.number.int({ min: 1, max: 100 }),
    });
  }

  /**
   * Generate a cart item with zero product ID
   */
  static generateCartItemWithZeroProductId(): AddCartItemRequest {
    return this.generateCartItem({ productId: 0 });
  }

  /**
   * Generate a cart item with negative quantity (for validation testing)
   */
  static generateCartItemWithNegativeQuantity(productId?: number): AddCartItemRequest {
    return this.generateCartItem({
      productId,
      quantity: -faker.number.int({ min: 1, max: 10 }),
    });
  }

  /**
   * Generate a cart item with zero quantity
   */
  static generateCartItemWithZeroQuantity(productId?: number): AddCartItemRequest {
    return this.generateCartItem({ productId, quantity: 0 });
  }

  /**
   * Generate a cart item with very large quantity
   */
  static generateCartItemWithLargeQuantity(productId?: number): AddCartItemRequest {
    return this.generateCartItem({
      productId,
      quantity: faker.number.int({ min: 1000, max: 10000 }),
    });
  }

  /**
   * Generate a cart item with non-existent product ID
   */
  static generateCartItemWithNonExistentProductId(): AddCartItemRequest {
    return this.generateCartItem({
      productId: faker.number.int({ min: 999999, max: 9999999 }),
    });
  }

  /**
   * Generate multiple cart items
   */
  static generateCartItems(count: number): AddCartItemRequest[] {
    return Array.from({ length: count }, () => this.generateCartItem());
  }

  /**
   * Generate cart items with different product IDs
   */
  static generateUniqueCartItems(count: number): AddCartItemRequest[] {
    const productIds = new Set<number>();
    const items: AddCartItemRequest[] = [];

    while (items.length < count) {
      const productId = faker.number.int({ min: 1, max: 1000 });
      if (!productIds.has(productId)) {
        productIds.add(productId);
        items.push(this.generateCartItemWithProductId(productId));
      }
    }

    return items;
  }

  /**
   * Generate a cart item with single quantity (buy one item)
   */
  static generateSingleQuantityCartItem(productId?: number): AddCartItemRequest {
    return this.generateCartItem({ productId, quantity: 1 });
  }

  /**
   * Generate a cart item with maximum typical quantity
   */
  static generateMaxQuantityCartItem(productId?: number): AddCartItemRequest {
    return this.generateCartItem({ productId, quantity: 99 });
  }
}
