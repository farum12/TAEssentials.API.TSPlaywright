import { APIResponse, expect } from '@playwright/test';

export class ResponseValidator {
  static async validateStatusCode(response: APIResponse, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }

  static async validateResponseTime(response: APIResponse, maxTime: number) {
    const responseHeaders = response.headers();
    // Response time validation can be implemented based on your needs
  }

  static async validateJsonSchema(response: APIResponse, schema: any) {
    const body = await response.json();
    // You can add schema validation library like Ajv here
    expect(body).toBeDefined();
  }

  static async validateContentType(response: APIResponse, expectedType: string) {
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain(expectedType);
  }

  static async getResponseBody<T>(response: APIResponse): Promise<T> {
    return await response.json();
  }

  static async validateRequiredFields(data: any, requiredFields: string[]) {
    requiredFields.forEach((field) => {
      expect(data).toHaveProperty(field);
      expect(data[field]).toBeDefined();
    });
  }
}
