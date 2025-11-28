export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5052',
  timeout: parseInt(process.env.API_TIMEOUT || '30000'),
  apiKey: process.env.API_KEY || '',
  authToken: process.env.AUTH_TOKEN || '',
  testEnv: process.env.TEST_ENV || 'local',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export const endpoints = {
  users: '/api/Users',
  register: '/api/Users/register',
  login: '/api/Users/login',
  logout: '/api/Users/logout',
  products: '/api/Products',
  cart: '/api/Cart',
  orders: '/api/Orders',
};
