import { APIResponse } from '@playwright/test';

/**
 * Retries a function with delay until it succeeds with the expected HTTP status or the maximum number of attempts is reached
 * @param fn - The function to retry that returns an APIResponse
 * @param expectedStatus - The expected HTTP status code (default: 200)
 * @param maxAttempts - Maximum number of retry attempts (default: 5)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns The successful APIResponse
 * @throws Error if max attempts are reached without success
 */
export async function retryUntilStatus(
    fn: () => Promise<APIResponse>,
    expectedStatus: number = 200,
    maxAttempts: number = 5,
    delayMs: number = 1000
): Promise<APIResponse> {
    let lastResponse: APIResponse | undefined;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            lastResponse = await fn();
            
            if (lastResponse.status() === expectedStatus) {
                return lastResponse;
            }
            
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    
    throw new Error(
        `Failed to get status ${expectedStatus} after ${maxAttempts} attempts. Last status: ${lastResponse?.status()}`
    );
}