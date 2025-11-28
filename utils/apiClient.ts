import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger';

export class ApiClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(url: string, options?: any): Promise<APIResponse> {
    logger.info(`GET request to: ${url}`);
    const response = await this.request.get(url, options);
    logger.info(`Response status: ${response.status()}`);
    return response;
  }

  async post(url: string, options?: any): Promise<APIResponse> {
    logger.info(`POST request to: ${url}`);
    const response = await this.request.post(url, options);
    logger.info(`Response status: ${response.status()}`);
    return response;
  }

  async put(url: string, options?: any): Promise<APIResponse> {
    logger.info(`PUT request to: ${url}`);
    const response = await this.request.put(url, options);
    logger.info(`Response status: ${response.status()}`);
    return response;
  }

  async patch(url: string, options?: any): Promise<APIResponse> {
    logger.info(`PATCH request to: ${url}`);
    const response = await this.request.patch(url, options);
    logger.info(`Response status: ${response.status()}`);
    return response;
  }

  async delete(url: string, options?: any): Promise<APIResponse> {
    logger.info(`DELETE request to: ${url}`);
    const response = await this.request.delete(url, options);
    logger.info(`Response status: ${response.status()}`);
    return response;
  }
}
