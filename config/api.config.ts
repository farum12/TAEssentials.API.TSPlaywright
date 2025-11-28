export const config = {
  baseUrl: process.env.BASE_URL || 'https://api.example.com',
  timeout: parseInt(process.env.API_TIMEOUT || '30000'),
  apiKey: process.env.API_KEY || '',
  authToken: process.env.AUTH_TOKEN || '',
  testEnv: process.env.TEST_ENV || 'staging',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export const endpoints = {
  users: '/users',
  posts: '/posts',
  comments: '/comments',
  todos: '/todos',
};
