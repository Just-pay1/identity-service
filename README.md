# identity service

## API Endpoints

### User Information Management

#### Edit User Information
**PUT** `/edit_info`

Updates user's personal information (name, email, phone). If email is being updated, a verification code is sent to the new email address.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "name": "New Name",     // optional
  "email": "new@email.com", // optional
  "phone": "1234567890"   // optional
}
```

**Response (No Email Update):**
```json
{
  "message": "User information updated successfully",
  "updatedFields": ["name", "phone"]
}
```

**Response (With Email Update):**
```json
{
  "message": "Verification code sent to new email address. Please verify to complete email update.",
  "verificationId": "abc123def456",
  "updatedFields": ["name", "phone"]
}
```

#### Verify Email Update
**POST** `/verify_email_update`

Verifies the OTP sent to the new email address and completes the email update process.

**Request Body:**
```json
{
  "verificationId": "abc123def456",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email updated successfully",
  "updatedEmail": "new@email.com"
}
```

## Docker

### 1. to RUN containers
```sh
docker-compose up -d --build
```

### 2. to Down
```sh
docker-compose down
```