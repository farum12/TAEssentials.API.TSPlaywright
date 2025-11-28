# UserFactory Usage Guide

The `UserFactory` class uses Faker to generate realistic test data for user registration testing.

## Basic Usage

### Generate a Complete User
```typescript
import { UserFactory } from '../utils/userFactory';

const user = UserFactory.generateUser();
// Returns a RegisterRequest with all fields populated with realistic data
```

### Generate a Minimal User (No Phone Number)
```typescript
const minimalUser = UserFactory.generateMinimalUser();
// Returns a RegisterRequest without phoneNumber field
```

### Generate User with Custom Fields
```typescript
const customUser = UserFactory.generateUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'custom@example.com'
});
// Override specific fields while keeping others auto-generated
```

## Specific Scenarios

### Unique Username/Email
```typescript
const username = UserFactory.generateUniqueUsername();
const email = UserFactory.generateUniqueEmail();
// Both include timestamps to ensure uniqueness
```

### User with Specific Username
```typescript
const user = UserFactory.generateUserWithUsername('myusername');
```

### User with Specific Email
```typescript
const user = UserFactory.generateUserWithEmail('test@example.com');
```

### Invalid Data for Negative Testing
```typescript
// Invalid email format
const invalidEmailUser = UserFactory.generateUserWithInvalidEmail();

// Weak password
const weakPasswordUser = UserFactory.generateUserWithWeakPassword();

// Empty fields
const emptyUser = UserFactory.generateUserWithEmptyFields();

// Special characters in username
const specialUser = UserFactory.generateUserWithSpecialUsername();
```

## Multiple Users
```typescript
const users = UserFactory.generateUsers(5);
// Returns array of 5 unique users
```

## Custom Passwords
```typescript
const password = UserFactory.generatePassword(
  12,              // length
  true,            // include uppercase
  true,            // include lowercase
  true,            // include numbers
  true             // include special characters
);
```

## Example Test
```typescript
test('should register user with valid data', async () => {
  const registerData = UserFactory.generateUser();
  
  const response = await apiClient.post(endpoints.register, {
    data: registerData,
  });
  
  expect(response.status()).toBe(200);
});
```

## Sample Generated Data

```typescript
{
  username: "john.doe123",
  password: "A7b#kL2mN9",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+1-555-123-4567"
}
```
