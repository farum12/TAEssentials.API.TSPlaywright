import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiClient';
import { ResponseValidator } from '../../utils/responseValidator';
import { TestDataGenerator } from '../../utils/testDataGenerator';
import { endpoints } from '../../config/api.config';
import { Post } from '../../models/api.models';

test.describe('Posts API Tests', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('GET /posts - should return all posts', async () => {
    const response = await apiClient.get(endpoints.posts);

    await ResponseValidator.validateStatusCode(response, 200);
    const posts = await ResponseValidator.getResponseBody<Post[]>(response);

    expect(posts).toBeInstanceOf(Array);
    expect(posts.length).toBeGreaterThan(0);
  });

  test('POST /posts - should create new post with generated data', async () => {
    const newPost = {
      userId: TestDataGenerator.generateRandomNumber(1, 10),
      title: TestDataGenerator.generateRandomString(20),
      body: TestDataGenerator.generateRandomString(100),
    };

    const response = await apiClient.post(endpoints.posts, {
      data: newPost,
    });

    await ResponseValidator.validateStatusCode(response, 201);

    const createdPost = await ResponseValidator.getResponseBody<Post>(response);
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
  });

  test('GET /posts?userId={userId} - should filter posts by user', async () => {
    const userId = 1;
    const response = await apiClient.get(`${endpoints.posts}?userId=${userId}`);

    await ResponseValidator.validateStatusCode(response, 200);

    const posts = await ResponseValidator.getResponseBody<Post[]>(response);
    posts.forEach((post) => {
      expect(post.userId).toBe(userId);
    });
  });
});
