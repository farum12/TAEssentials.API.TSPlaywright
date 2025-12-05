import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { ResponseValidator } from '../../utils/responseValidator';
import { UserFactory } from '../../utils/factories/userFactory';
import { LittleBugShop } from '../../utils/urlBuilders/littleBugShopUrlBuilder';
import { RegisterRequest, RegisterResponse } from '../../models/user.models';
import { TestDecorators, TestSeverity as Severity } from '../../utils/testDecorators';

  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });


test.describe('User Registration API Tests - POST /api/Users/register', () => {
  TestDecorators.setupTestDescribe({
    suite: 'User Registration API Tests',
    suiteDescription: 'Tests for the POST /api/Users/register endpoint',
    epic: 'User Management',
    feature: 'User Registration'
  });


  test('TC 001 Validate successful user registration with valid data', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful user registration with all valid fields',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let registerData: RegisterRequest;
    let response: any;
    let result: RegisterResponse;

    await test.step('Generate user test data', async () => {
      registerData = UserFactory.generateUser();
    });

    await test.step('Send registration request', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
    });

    await test.step('Validate response status and content type', async () => {
      expect(response.status()).toBe(201);
      await ResponseValidator.validateContentType(response, 'application/json');
    });

    await test.step('Parse response body', async () => {
      result = await ResponseValidator.getResponseBody<RegisterResponse>(response);
    });

    await test.step('Verify response structure and data', async () => {
      expect(result.message).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe(registerData.username);
      expect(result.user.email).toBe(registerData.email);
      expect(result.user.firstName).toBe(registerData.firstName);
      expect(result.user.lastName).toBe(registerData.lastName);
      expect(result.user.id).toBeGreaterThan(0);
      expect(result.user.role).toBeDefined();
      expect(result.user.createdAt).toBeDefined();
    });
  });

  test('TC 002 Validate successful registration without optional phone number', async () => {
    await TestDecorators.setupTest({
      description: 'Validate successful user registration without optional phone number field',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let registerData: RegisterRequest;
    let response: any;
    let result: RegisterResponse;

    await test.step('Generate minimal user test data (no phone)', async () => {
      registerData = UserFactory.generateMinimalUser();
    });

    await test.step('Send registration request', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status()).toBe(201);
    });

    await test.step('Parse response body', async () => {
      result = await ResponseValidator.getResponseBody<RegisterResponse>(response);
    });

    await test.step('Verify user data matches request', async () => {
      expect(result.user.username).toBe(registerData.username);
      expect(result.user.email).toBe(registerData.email);
    });
  });

  test('TC 003 Validate rejection of duplicate username', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects registration with duplicate username',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let username: string;
    let registerData: RegisterRequest;
    let firstResponse: any;
    let duplicateData: RegisterRequest;
    let duplicateResponse: any;

    await test.step('Generate unique username and user data', async () => {
      username = UserFactory.generateUniqueUsername();
      registerData = UserFactory.generateUserWithUsername(username);
    });

    await test.step('Register first user successfully', async () => {
      firstResponse = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
      expect(firstResponse.status()).toBe(201);
    });

    await test.step('Attempt duplicate registration with same username', async () => {
      duplicateData = UserFactory.generateUserWithUsername(username);
      duplicateResponse = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: duplicateData,
      });
    });

    await test.step('Verify duplicate is rejected with 400', async () => {
      expect(duplicateResponse.status()).toBe(400);
    });
  });

  test('TC 004 Validate rejection of duplicate email', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects registration with duplicate email address',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let email: string;
    let registerData: RegisterRequest;
    let firstResponse: any;
    let duplicateData: RegisterRequest;
    let duplicateResponse: any;

    await test.step('Generate unique email and user data', async () => {
      email = UserFactory.generateUniqueEmail();
      registerData = UserFactory.generateUserWithEmail(email);
    });

    await test.step('Register first user successfully', async () => {
      firstResponse = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
      expect(firstResponse.status()).toBe(201);
    });

    await test.step('Attempt duplicate registration with same email', async () => {
      duplicateData = UserFactory.generateUserWithEmail(email);
      duplicateResponse = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: duplicateData,
      });
    });

    await test.step('Verify duplicate is rejected with 400 or 409', async () => {
      expect(duplicateResponse.status()).toBe(400);
    });
  });

  test('TC 005 Validate required field validation for username', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API requires username field in registration request',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let incompleteData: any;
    let response: any;

    await test.step('Generate user data without username', async () => {
      const userData = UserFactory.generateUser();
      const { username, ...dataWithoutUsername } = userData;
      incompleteData = dataWithoutUsername;
    });

    await test.step('Send registration request with missing username', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: incompleteData,
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status()).toBe(400);
    });
  });

  test('TC 006 Validate required field validation for password', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API requires password field in registration request',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let incompleteData: any;
    let response: any;

    await test.step('Generate user data without password', async () => {
      const userData = UserFactory.generateUser();
      const { password, ...dataWithoutPassword } = userData;
      incompleteData = dataWithoutPassword;
    });

    await test.step('Send registration request with missing password', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: incompleteData,
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status()).toBe(400);
    });
  });

  test('TC 007 Validate required field validation for email', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API requires email field in registration request',
      owner: 'Farum',
      severity: Severity.CRITICAL
    });

    let incompleteData: any;
    let response: any;

    await test.step('Generate user data without email', async () => {
      const userData = UserFactory.generateUser();
      const { email, ...dataWithoutEmail } = userData;
      incompleteData = dataWithoutEmail;
    });

    await test.step('Send registration request with missing email', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: incompleteData,
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status()).toBe(400);
    });
  });

  test('TC 008 Validate email format validation', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects invalid email format in registration',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let registerData: RegisterRequest;
    let response: any;

    await test.step('Generate user data with invalid email', async () => {
      registerData = UserFactory.generateUserWithInvalidEmail();
    });

    await test.step('Send registration request with invalid email', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status()).toBe(400);
    });
  });

  test('TC 009 Validate password strength requirements', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API enforces password strength requirements',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let registerData: RegisterRequest;
    let response: any;

    await test.step('Generate user data with weak password', async () => {
      registerData = UserFactory.generateUserWithWeakPassword();
    });

    await test.step('Send registration request with weak password', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status()).toBe(400);
    });
  });

  test('TC 010 Validate rejection of empty string values', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API rejects registration with empty string values',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let registerData: RegisterRequest;
    let response: any;

    await test.step('Generate user data with empty fields', async () => {
      registerData = UserFactory.generateUserWithEmptyFields();
    });

    await test.step('Send registration request with empty fields', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
    });

    await test.step('Verify request is rejected with 400', async () => {
      expect(response.status()).toBe(400);
    });
  });

  test('TC 011 Validate handling of special characters in username', async () => {
    await TestDecorators.setupTest({
      description: 'Validate API handling of special characters in username field',
      owner: 'Farum',
      severity: Severity.MINOR
    });

    let registerData: RegisterRequest;
    let response: any;

    await test.step('Generate user data with special characters in username', async () => {
      registerData = UserFactory.generateUserWithSpecialUsername();
    });

    await test.step('Send registration request with special username', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
    });

    await test.step('Verify response based on API validation rules', async () => {
      if (response.status() === 201) {
        const result = await ResponseValidator.getResponseBody<RegisterResponse>(response);
        expect(result.user.username).toBe(registerData.username);
      } else {
        expect(response.status()).toBe(400);
      }
    });
  });

  test('TC 012 Validate response structure for successful registration', async () => {
    await TestDecorators.setupTest({
      description: 'Validate response structure and data types for successful registration',
      owner: 'Farum',
      severity: Severity.NORMAL
    });

    let registerData: RegisterRequest;
    let response: any;
    let result: RegisterResponse;

    await test.step('Generate user test data', async () => {
      registerData = UserFactory.generateUser();
    });

    await test.step('Send registration request', async () => {
      response = await apiClient.post(LittleBugShop().Controllers.Users.register, {
        data: registerData,
      });
    });

    await test.step('Validate response status', async () => {
      expect(response.status()).toBe(201);
    });

    await test.step('Parse response body', async () => {
      result = await ResponseValidator.getResponseBody<RegisterResponse>(response);
    });

    await test.step('Validate response has required fields', async () => {
      await ResponseValidator.validateRequiredFields(result, ['message', 'user']);
      await ResponseValidator.validateRequiredFields(result.user, [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'role',
        'createdAt',
      ]);
    });

    await test.step('Validate field data types', async () => {
      expect(typeof result.message).toBe('string');
      expect(typeof result.user.id).toBe('number');
      expect(typeof result.user.username).toBe('string');
      expect(typeof result.user.email).toBe('string');
      expect(typeof result.user.createdAt).toBe('string');
    });
  });
}
);
