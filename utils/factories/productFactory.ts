import { faker } from '@faker-js/faker';

export interface Product {
  id?: number;
  name: string;
  author: string;
  genre: string;
  isbn: string;
  price: number;
  description: string;
  type: string;
  stockQuantity: number;
  lowStockThreshold: number;
}

export class ProductFactory {
  private static readonly BOOK_GENRES = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Horror',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Children',
    'Young Adult',
    'Poetry',
  ];

  private static readonly PRODUCT_TYPES = [
    'Book',
    'E-Book',
    'Audiobook',
    'Hardcover',
    'Paperback',
  ];

  /**
   * Generate a complete product with all fields
   */
  static generateProduct(overrides?: Partial<Product>): Product {
    const title = faker.book.title();
    const author = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const genre = faker.helpers.arrayElement(this.BOOK_GENRES);
    const type = faker.helpers.arrayElement(this.PRODUCT_TYPES);
    const price = parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 }));
    const stockQuantity = faker.number.int({ min: 0, max: 500 });
    const lowStockThreshold = faker.number.int({ min: 5, max: 20 });

    return {
      name: title,
      author: author,
      genre: genre,
      isbn: this.generateISBN(),
      price: price,
      description: faker.lorem.paragraph({ min: 2, max: 5 }),
      type: type,
      stockQuantity: stockQuantity,
      lowStockThreshold: lowStockThreshold,
      ...overrides,
    };
  }

  /**
   * Generate a product with specific name
   */
  static generateProductWithName(name: string): Product {
    return this.generateProduct({ name });
  }

  /**
   * Generate a product with specific author
   */
  static generateProductWithAuthor(author: string): Product {
    return this.generateProduct({ author });
  }

  /**
   * Generate a product with specific genre
   */
  static generateProductWithGenre(genre: string): Product {
    return this.generateProduct({ genre });
  }

  /**
   * Generate a product with specific type
   */
  static generateProductWithType(type: string): Product {
    return this.generateProduct({ type });
  }

  /**
   * Generate a product with specific price
   */
  static generateProductWithPrice(price: number): Product {
    return this.generateProduct({ price });
  }

  /**
   * Generate a product with specific stock quantity
   */
  static generateProductWithStock(stockQuantity: number): Product {
    return this.generateProduct({ stockQuantity });
  }

  /**
   * Generate a product with low stock (below threshold)
   */
  static generateProductWithLowStock(): Product {
    const lowStockThreshold = faker.number.int({ min: 10, max: 20 });
    const stockQuantity = faker.number.int({ min: 1, max: lowStockThreshold - 1 });
    return this.generateProduct({ stockQuantity, lowStockThreshold });
  }

  /**
   * Generate a product that is out of stock
   */
  static generateOutOfStockProduct(): Product {
    return this.generateProduct({ stockQuantity: 0 });
  }

  /**
   * Generate a product with high stock
   */
  static generateProductWithHighStock(): Product {
    const stockQuantity = faker.number.int({ min: 200, max: 1000 });
    return this.generateProduct({ stockQuantity });
  }

  /**
   * Generate a product with negative price (for validation testing)
   */
  static generateProductWithNegativePrice(): Product {
    return this.generateProduct({ price: -faker.number.float({ min: 1, max: 100, fractionDigits: 2 }) });
  }

  /**
   * Generate a product with zero price
   */
  static generateProductWithZeroPrice(): Product {
    return this.generateProduct({ price: 0 });
  }

  /**
   * Generate a product with invalid ISBN (for validation testing)
   */
  static generateProductWithInvalidISBN(): Product {
    return this.generateProduct({ isbn: faker.string.alphanumeric(5) });
  }

  /**
   * Generate a product with empty required fields
   */
  static generateProductWithEmptyFields(): Product {
    return {
      name: '',
      author: '',
      genre: '',
      isbn: '',
      price: 0,
      description: '',
      type: '',
      stockQuantity: 0,
      lowStockThreshold: 0,
    };
  }

  /**
   * Generate a product with very long name (for validation testing)
   */
  static generateProductWithLongName(): Product {
    return this.generateProduct({
      name: faker.lorem.words(50), // Very long name
    });
  }

  /**
   * Generate a product with very long description
   */
  static generateProductWithLongDescription(): Product {
    return this.generateProduct({
      description: faker.lorem.paragraphs(20), // Very long description
    });
  }

  /**
   * Generate a product with special characters in name
   */
  static generateProductWithSpecialCharactersInName(): Product {
    const specialChars = ['!', '@', '#', '$', '%', '&', '*'];
    const randomChar = faker.helpers.arrayElement(specialChars);
    return this.generateProduct({
      name: `${faker.lorem.words(2)}${randomChar}${faker.lorem.word()}`,
    });
  }

  /**
   * Generate multiple products
   */
  static generateProducts(count: number): Product[] {
    return Array.from({ length: count }, () => this.generateProduct());
  }

  /**
   * Generate products with different genres
   */
  static generateProductsByGenre(genre: string, count: number): Product[] {
    return Array.from({ length: count }, () => this.generateProductWithGenre(genre));
  }

  /**
   * Generate products by the same author
   */
  static generateProductsByAuthor(author: string, count: number): Product[] {
    return Array.from({ length: count }, () => this.generateProductWithAuthor(author));
  }

  /**
   * Generate a unique ISBN-13 format
   * Format: 978-X-XXXX-XXXX-X
   */
  static generateISBN(): string {
    const prefix = '978';
    const group = faker.number.int({ min: 0, max: 9 });
    const publisher = faker.string.numeric(4);
    const title = faker.string.numeric(4);
    const checkDigit = faker.number.int({ min: 0, max: 9 });

    return `${prefix}-${group}-${publisher}-${title}-${checkDigit}`;
  }

  /**
   * Generate a unique ISBN-10 format (legacy)
   * Format: X-XXXX-XXXX-X
   */
  static generateISBN10(): string {
    const group = faker.number.int({ min: 0, max: 9 });
    const publisher = faker.string.numeric(4);
    const title = faker.string.numeric(4);
    const checkDigit = faker.number.int({ min: 0, max: 9 });

    return `${group}-${publisher}-${title}-${checkDigit}`;
  }

  /**
   * Generate a product with minimal required fields for creation
   */
  static generateMinimalProduct(): Product {
    return {
      name: faker.lorem.words({ min: 2, max: 4 }),
      author: `${faker.person.firstName()} ${faker.person.lastName()}`,
      genre: faker.helpers.arrayElement(this.BOOK_GENRES),
      isbn: this.generateISBN(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 50, dec: 2 })),
      description: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(this.PRODUCT_TYPES),
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      lowStockThreshold: 10,
    };
  }

  /**
   * Generate a bestseller product (high price, specific genres)
   */
  static generateBestsellerProduct(): Product {
    const bestsellerGenres = ['Fiction', 'Mystery', 'Thriller', 'Science Fiction'];
    return this.generateProduct({
      genre: faker.helpers.arrayElement(bestsellerGenres),
      price: parseFloat(faker.commerce.price({ min: 20, max: 50, dec: 2 })),
      stockQuantity: faker.number.int({ min: 100, max: 500 }),
      type: 'Hardcover',
    });
  }

  /**
   * Generate a budget product (low price)
   */
  static generateBudgetProduct(): Product {
    return this.generateProduct({
      price: parseFloat(faker.commerce.price({ min: 1, max: 10, dec: 2 })),
      type: 'Paperback',
    });
  }

  /**
   * Generate a digital product (E-Book or Audiobook)
   */
  static generateDigitalProduct(): Product {
    const digitalTypes = ['E-Book', 'Audiobook'];
    return this.generateProduct({
      type: faker.helpers.arrayElement(digitalTypes),
      stockQuantity: 9999, // Digital products have unlimited stock
      lowStockThreshold: 0,
    });
  }

  /**
   * Generate a product with all available genres
   */
  static getAvailableGenres(): string[] {
    return [...this.BOOK_GENRES];
  }

  /**
   * Generate a product with all available types
   */
  static getAvailableTypes(): string[] {
    return [...this.PRODUCT_TYPES];
  }
}
