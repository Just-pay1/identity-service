# Testing the Edit Info Endpoints

## Prerequisites
1. Make sure the server is running on port 3000
2. Have a valid JWT token from login/register
3. Set up environment variables for email functionality (MAIL_TRAP_USER, MAIL_TRAP_PASSWORD, MAIL_TRAP_PORT)

## Test Scenarios

### 1. Update Name and Phone Only (No Email Change)

**Request:**
```bash
curl -X PUT http://localhost:3000/edit_info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe Updated",
    "phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "message": "User information updated successfully",
  "updatedFields": ["name", "phone"]
}
```

### 2. Update Email (Requires Verification)

**Request:**
```bash
curl -X PUT http://localhost:3000/edit_info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "newemail@example.com",
    "phone": "1234567890"
  }'
```

**Expected Response:**
```json
{
  "message": "Verification code sent to new email address. Please verify to complete email update.",
  "verificationId": "abc123def456",
  "updatedFields": ["name", "phone"]
}
```

### 3. Verify Email Update

**Request:**
```bash
curl -X POST http://localhost:3000/verify_email_update \
  -H "Content-Type: application/json" \
  -d '{
    "verificationId": "abc123def456",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "message": "Email updated successfully",
  "updatedEmail": "newemail@example.com"
}
```

### 4. Error Cases

#### Invalid Token
```bash
curl -X PUT http://localhost:3000/edit_info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"name": "Test"}'
```

#### Email Already Taken
```bash
curl -X PUT http://localhost:3000/edit_info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"email": "existing@email.com"}'
```

#### Invalid OTP
```bash
curl -X POST http://localhost:3000/verify_email_update \
  -H "Content-Type: application/json" \
  -d '{
    "verificationId": "abc123def456",
    "otp": "000000"
  }'
```

## Environment Variables Required

Make sure these environment variables are set:
- `JWT_ACCESS_SECRET`: Secret for JWT token signing
- `JWT_REFRESH_SECRET`: Secret for refresh token signing
- `MAIL_TRAP_USER`: Mailtrap username for email sending
- `MAIL_TRAP_PASSWORD`: Mailtrap password for email sending
- `MAIL_TRAP_PORT`: Mailtrap port for email sending
- Database configuration variables (DB_NAME, DB_USER, etc.)

---

# Testing the Authenticated User Search API

## Endpoint: `POST /user/search`

This endpoint allows authenticated users to search for another user by username.

## Prerequisites
1. Make sure the server is running on port 3000
2. Have a valid JWT token from login/register
3. Ensure there are users in the database with usernames

## Test Scenarios

### 1. Successful Search - Different User Found

**Request:**
```bash
curl -X POST http://localhost:3000/user/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "johndoe"
  }'
```

**Expected Response (200 OK):**
```json
{
  "id": 2,
  "name": "John Doe",
  "username": "qqqq"
}
```

### 2. User Not Found

**Request:**
```bash
curl -X POST http://localhost:3000/user/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "nonexistentuser"
  }'
```

**Expected Response (404 Not Found):**
```json
{
  "error": "Not found user with this username."
}
```

### 3. Searching for Yourself

**Request:**
```bash
curl -X POST http://localhost:3000/user/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "your_own_username"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "You are searching for yourself."
}
```

### 4. Authentication Required

**Request (No Authorization Header):**
```bash
curl -X POST http://localhost:3000/user/search \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe"
  }'
```

**Expected Response (402 Payment Required - Custom status for auth failure):**
```json
{
  "error": "Access denied. No token provided."
}
```

### 5. Invalid Token

**Request:**
```bash
curl -X POST http://localhost:3000/user/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{
    "username": "johndoe"
  }'
```

**Expected Response (402 Payment Required):**
```json
{
  "error": "Invalid or expired token."
}
```

### 6. Validation Errors

#### Missing Username
**Request:**
```bash
curl -X POST http://localhost:3000/user/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{}'
```

**Expected Response (422 Unprocessable Entity):**
```json
{
  "error": "Validation error",
  "details": "username is required"
}
```

#### Invalid Username Format
**Request:**
```bash
curl -X POST http://localhost:3000/user/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "a"
  }'
```

**Expected Response (422 Unprocessable Entity):**
```json
{
  "error": "Validation error",
  "details": "username must be at least 3 characters long"
}
```

## Security Features

1. **Authentication Required**: Only authenticated users can access this endpoint
2. **Input Validation**: Username is validated for format and length
3. **Data Protection**: Only safe fields (id, name) are returned, no sensitive data
4. **Self-Search Prevention**: Users cannot search for themselves
5. **Proper Error Handling**: Clear error messages with appropriate HTTP status codes

## API Response Format

### Success Response
- **Status**: 200 OK
- **Body**: `{"id": number, "name": string}`

### Error Responses
- **404 Not Found**: User not found
- **400 Bad Request**: Searching for yourself
- **402 Payment Required**: Authentication issues
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server errors 