import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { ResponseValidator } from '../../utils/responseValidator';
import { UserFactory } from '../../utils/userFactory';
import { endpoints } from '../../config/api.config';
import { RegisterRequest, RegisterResponse } from '../../models/user.models';

test.describe('User Registration API Tests - POST /api/Users/register', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('should successfully register a new user with valid data', async () => {
    const registerData = UserFactory.generateUser();

    const response = await apiClient.post(endpoints.register, {
      data: registerData,
    });

    await ResponseValidator.validateStatusCode(response, 200);
    await ResponseValidator.validateContentType(response, 'application/json');

    const result = await ResponseValidator.getResponseBody<RegisterResponse>(response);

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

  test('should successfully register a new user without optional phone number', async () => {
    const registerData = UserFactory.generateMinimalUser();

    const response = await apiClient.post(endpoints.register, {
      data: registerData,
    });

    await ResponseValidator.validateStatusCode(response, 200);

    const result = await ResponseValidator.getResponseBody<RegisterResponse>(response);

    expect(result.user.username).toBe(registerData.username);
    expect(result.user.email).toBe(registerData.email);
  });

  test('should reject registration with duplicate username', async () => {
    const username = UserFactory.generateUniqueUsername();
    const registerData = UserFactory.generateUserWithUsername(username);

    // First registration
    const firstResponse = await apiClient.post(endpoints.register, {
      data: registerData,
    });
    await ResponseValidator.validateStatusCode(firstResponse, 200);

    // Attempt duplicate registration with same username
    const duplicateData = UserFactory.generateUserWithUsername(username);

    const duplicateResponse = await apiClient.post(endpoints.register, {
      data: duplicateData,
    });

    // Should fail with 400 or 409 status
    expect([400, 409]).toContain(duplicateResponse.status());
  });

  test('should reject registration with duplicate email', async () => {
    const email = UserFactory.generateUniqueEmail();
    const registerData = UserFactory.generateUserWithEmail(email);

    // First registration
    const firstResponse = await apiClient.post(endpoints.register, {
      data: registerData,
    });
    await ResponseValidator.validateStatusCode(firstResponse, 200);

    // Attempt duplicate registration with same email
    const duplicateData = UserFactory.generateUserWithEmail(email);

    const duplicateResponse = await apiClient.post(endpoints.register, {
      data: duplicateData,
    });

    // Should fail with 400 or 409 status
    expect([400, 409]).toContain(duplicateResponse.status());
  });

  test('should reject registration with missing required fields - username', async () => {
    const userData = UserFactory.generateUser();
    const { username, ...incompleteData } = userData;

    const response = await apiClient.post(endpoints.register, {
      data: incompleteData,
    });

    // Should fail with 400 Bad Request
    expect([400]).toContain(response.status());
  });

  test('should reject registration with missing required fields - password', async () => {
    const userData = UserFactory.generateUser();
    const { password, ...incompleteData } = userData;

    const response = await apiClient.post(endpoints.register, {
      data: incompleteData,
    });

    // Should fail with 400 Bad Request
    expect([400]).toContain(response.status());
  });

  test('should reject registration with missing required fields - email', async () => {
    const userData = UserFactory.generateUser();
    const { email, ...incompleteData } = userData;

    const response = await apiClient.post(endpoints.register, {
      data: incompleteData,
    });

    // Should fail with 400 Bad Request
    expect([400]).toContain(response.status());
  });

  test('should reject registration with invalid email format', async () => {
    const registerData = UserFactory.generateUserWithInvalidEmail();

    const response = await apiClient.post(endpoints.register, {
      data: registerData,
    });

    // Should fail with 400 Bad Request
    expect([400]).toContain(response.status());
  });

  test('should reject registration with weak password', async () => {
    const registerData = UserFactory.generateUserWithWeakPassword();

    const response = await apiClient.post(endpoints.register, {
      data: registerData,
    });

    // Should fail with 400 Bad Request due to password requirements
    expect([400]).toContain(response.status());
  });

  test('should reject registration with empty string values', async () => {
    const registerData = UserFactory.generateUserWithEmptyFields();

    const response = await apiClient.post(endpoints.register, {
      data: registerData,
    });

    // Should fail with 400 Bad Request
    expect([400]).toContain(response.status());
  });

  test('should handle special characters in username', async () => {
    const registerData = UserFactory.generateUserWithSpecialUsername();

    const response = await apiClient.post(endpoints.register, {
      data: registerData,
    });

    // May succeed or fail based on API validation rules
    if (response.status() === 200) {
      const result = await ResponseValidator.getResponseBody<RegisterResponse>(response);
      expect(result.user.username).toBe(registerData.username);
    } else {
      expect([400]).toContain(response.status());
    }
  });

  test('should validate response structure for successful registration', async () => {
    const registerData = UserFactory.generateUser();

    const response = await apiClient.post(endpoints.register, {
      data: registerData,
    });

    await ResponseValidator.validateStatusCode(response, 200);

    const result = await ResponseValidator.getResponseBody<RegisterResponse>(response);

    // Validate response structure
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

    // Validate data types
    expect(typeof result.message).toBe('string');
    expect(typeof result.user.id).toBe('number');
    expect(typeof result.user.username).toBe('string');
    expect(typeof result.user.email).toBe('string');
    expect(typeof result.user.createdAt).toBe('string');
  });
}
);
