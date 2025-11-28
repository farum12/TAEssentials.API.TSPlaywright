import { faker } from '@faker-js/faker';
import { RegisterRequest } from '../models/user.models';

export class UserFactory {
  /**
   * Generate a complete user registration request with all fields
   */
  static generateUser(overrides?: Partial<RegisterRequest>): RegisterRequest {
    return {
      username: faker.internet.username().toLowerCase(),
      password: this.generateSecurePassword(),
      email: faker.internet.email().toLowerCase(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      ...overrides,
    };
  }

  /**
   * Generate a user with only required fields (no phone number)
   */
  static generateMinimalUser(overrides?: Partial<RegisterRequest>): RegisterRequest {
    const user = this.generateUser(overrides);
    delete user.phoneNumber;
    return user;
  }

  /**
   * Generate a user with a specific username
   */
  static generateUserWithUsername(username: string): RegisterRequest {
    return this.generateUser({ username });
  }

  /**
   * Generate a user with a specific email
   */
  static generateUserWithEmail(email: string): RegisterRequest {
    return this.generateUser({ email });
  }

  /**
   * Generate a user with invalid email format
   */
  static generateUserWithInvalidEmail(): RegisterRequest {
    return this.generateUser({
      email: faker.string.alphanumeric(10), // No @ symbol
    });
  }

  /**
   * Generate a user with weak password
   */
  static generateUserWithWeakPassword(): RegisterRequest {
    return this.generateUser({
      password: faker.string.alphanumeric(3), // Too short
    });
  }

  /**
   * Generate a user with empty fields
   */
  static generateUserWithEmptyFields(): RegisterRequest {
    return {
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    };
  }

  /**
   * Generate a user with special characters in username
   */
  static generateUserWithSpecialUsername(): RegisterRequest {
    const specialChars = ['_', '-', '.'];
    const randomChar = faker.helpers.arrayElement(specialChars);
    const username = `${faker.word.noun()}${randomChar}${faker.number.int({ min: 100, max: 999 })}`;
    return this.generateUser({ username: username.toLowerCase() });
  }

  /**
   * Generate multiple users
   */
  static generateUsers(count: number): RegisterRequest[] {
    return Array.from({ length: count }, () => this.generateUser());
  }

  /**
   * Generate a secure password that meets common requirements
   * - At least 8 characters
   * - Contains uppercase and lowercase letters
   * - Contains numbers
   * - Contains special characters
   */
  private static generateSecurePassword(): string {
    const uppercase = faker.string.alpha({ length: 2, casing: 'upper' });
    const lowercase = faker.string.alpha({ length: 2, casing: 'lower' });
    const numbers = faker.string.numeric(2);
    const special = faker.helpers.arrayElement(['@', '#', '$', '%', '&', '*']);
    const additional = faker.string.alphanumeric(3);

    // Shuffle the characters
    const password = (uppercase + lowercase + numbers + special + additional)
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return password;
  }

  /**
   * Generate a custom password with specific requirements
   */
  static generatePassword(
    length: number = 10,
    includeUppercase: boolean = true,
    includeLowercase: boolean = true,
    includeNumbers: boolean = true,
    includeSpecial: boolean = true
  ): string {
    let chars = '';
    let password = '';

    if (includeUppercase) {
      chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      password += faker.string.alpha({ length: 1, casing: 'upper' });
    }
    if (includeLowercase) {
      chars += 'abcdefghijklmnopqrstuvwxyz';
      password += faker.string.alpha({ length: 1, casing: 'lower' });
    }
    if (includeNumbers) {
      chars += '0123456789';
      password += faker.string.numeric(1);
    }
    if (includeSpecial) {
      chars += '@#$%&*!';
      password += faker.helpers.arrayElement(['@', '#', '$', '%', '&', '*', '!']);
    }

    // Fill remaining length
    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
      password += faker.helpers.arrayElement(chars.split(''));
    }

    // Shuffle
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Generate a unique username with timestamp
   */
  static generateUniqueUsername(): string {
    const timestamp = Date.now();
    return `${faker.internet.username().toLowerCase()}_${timestamp}`;
  }

  /**
   * Generate a unique email with timestamp
   */
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `test_${timestamp}_${faker.internet.email().toLowerCase()}`;
  }
}
