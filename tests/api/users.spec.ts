import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { ResponseValidator } from '../../utils/responseValidator';
import { endpoints } from '../../config/api.config';
import { User } from '../../models/api.models';

test.describe('User API Tests', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('GET /users - should return list of users', async () => {
    const response = await apiClient.get(endpoints.users);

    await ResponseValidator.validateStatusCode(response, 200);
    await ResponseValidator.validateContentType(response, 'application/json');

    const users = await ResponseValidator.getResponseBody<User[]>(response);
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);

    // Validate first user has required fields
    if (users.length > 0) {
      await ResponseValidator.validateRequiredFields(users[0], [
        'id',
        'name',
        'username',
        'email',
      ]);
    }
  });

  test('GET /users/{id} - should return single user', async () => {
    const userId = 1;
    const response = await apiClient.get(`${endpoints.users}/${userId}`);

    await ResponseValidator.validateStatusCode(response, 200);

    const user = await ResponseValidator.getResponseBody<User>(response);
    expect(user.id).toBe(userId);
    await ResponseValidator.validateRequiredFields(user, ['id', 'name', 'email']);
  });

  test('POST /users - should create new user', async () => {
    const newUser = {
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@example.com',
    };

    const response = await apiClient.post(endpoints.users, {
      data: newUser,
    });

    await ResponseValidator.validateStatusCode(response, 201);

    const createdUser = await ResponseValidator.getResponseBody<User>(response);
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
  });

  test('PUT /users/{id} - should update user', async () => {
    const userId = 1;
    const updatedUser = {
      id: userId,
      name: 'Updated Name',
      username: 'updateduser',
      email: 'updated@example.com',
    };

    const response = await apiClient.put(`${endpoints.users}/${userId}`, {
      data: updatedUser,
    });

    await ResponseValidator.validateStatusCode(response, 200);

    const user = await ResponseValidator.getResponseBody<User>(response);
    expect(user.name).toBe(updatedUser.name);
  });

  test('DELETE /users/{id} - should delete user', async () => {
    const userId = 1;
    const response = await apiClient.delete(`${endpoints.users}/${userId}`);

    await ResponseValidator.validateStatusCode(response, 200);
  });

  test('GET /users/{id} - should return 404 for non-existent user', async () => {
    const nonExistentId = 99999;
    const response = await apiClient.get(`${endpoints.users}/${nonExistentId}`);

    await ResponseValidator.validateStatusCode(response, 404);
  });
});
