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