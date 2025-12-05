import { base } from '@faker-js/faker/.';
import { createLittleBugShopEndpoints } from './enpoints/littleBugShopEnpoints';

/**
 * Creates a new URL builder instance for LittleBugShop API
 * @param baseUrl Optional base URL, defaults to configured base URL
 * @returns UrlBuilder instance
 * 
 * @example
 * // Using default base URL
 * const url = LittleBugShop().Users.register();
 * // Returns: "http://localhost:5052/api/Users/register"
 * 
 * @example
 * // Using custom base URL
 * const url = LittleBugShop('https://production.com').Users.login();
 * // Returns: "https://production.com/api/Users/login"
 * 
 * @example
 * // With ID parameters
 * const url = LittleBugShop().Users.getById(123);
 * // Returns: "http://localhost:5052/api/Users/123"
 */
export function LittleBugShop() {
   const baseUrl = `${process.env.BASE_URL}`;

   return {
    BaseUrl: baseUrl,
    Controllers: createLittleBugShopEndpoints((path: string) => `${baseUrl}/api${path}`)
   }
}