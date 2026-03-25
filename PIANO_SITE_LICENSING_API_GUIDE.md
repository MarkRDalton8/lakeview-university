# Piano Site Licensing API Guide

Complete guide to managing institutional site licenses via the Piano VX API.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Core Endpoints](#core-endpoints)
4. [Common Workflows](#common-workflows)
5. [API Examples](#api-examples)
6. [Response Formats](#response-formats)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Overview

The Piano Site Licensing API enables programmatic management of institutional site licenses, allowing you to:

- ✅ Bulk upload users to site license contracts
- ✅ Grant and revoke access programmatically
- ✅ List all users in a contract
- ✅ Manage user status (pending, active, revoked)
- ✅ Automate user provisioning workflows
- ✅ Integrate with institutional identity systems

**Base URL:** `https://api.tinypass.com/api/v3`

**Authentication:** API Token (bearer authentication)

---

## Authentication

All Piano API requests require an API token and Application ID (AID).

### Getting Your Credentials

1. **API Token**
   - Piano Dashboard → Settings → API
   - Generate a new token or use an existing one
   - Keep this secret and secure

2. **Application ID (AID)**
   - Found in Piano Dashboard → Settings
   - Example: `QiNgMM49pu`

3. **Contract ID**
   - Piano Dashboard → Products → Licenses → [Your License] → Contracts
   - Click on a contract to see the Contract ID
   - Example: `TMQ29SR23ZTA`

### Authentication Parameters

Every API request must include:

```
api_token=YOUR_API_TOKEN_HERE
aid=YOUR_APPLICATION_ID
```

---

## Core Endpoints

### 1. Create Contract User

**Endpoint:** `POST /publisher/licensing/contractUser/create`

**Purpose:** Add a user to a site license contract

**Required Parameters:**
- `api_token` - Your API token
- `aid` - Application ID
- `contract_id` - The contract ID
- `email` - User's email address
- `first_name` - User's first name
- `last_name` - User's last name

**Optional Parameters:**
- Custom fields (e.g., `custom_field_department`, `custom_field_student_id`)

**Example Request:**
```http
POST https://api.tinypass.com/api/v3/publisher/licensing/contractUser/create
Content-Type: application/x-www-form-urlencoded

api_token=YOUR_TOKEN
&aid=QiNgMM49pu
&contract_id=TMQ29SR23ZTA
&email=sarah.johnson@university.edu
&first_name=Sarah
&last_name=Johnson
```

**Example Response:**
```json
{
  "code": 0,
  "contract_user": {
    "contract_user_id": "CUMG693V0I2V",
    "status": "PENDING",
    "email": "sarah.johnson@university.edu",
    "first_name": "Sarah",
    "last_name": "Johnson"
  }
}
```

**What Happens:**
- User is added to the contract in "PENDING" status
- Piano sends an invitation email to the user
- User can redeem access via the landing page

---

### 2. Redeem Contract Access

**Endpoint:** `POST /publisher/licensing/contract/redeem`

**Purpose:** Activate access for a pending user (admin-initiated redemption)

**Required Parameters:**
- `api_token` - Your API token
- `aid` - Application ID
- `contract_id` - The contract ID
- `email` - User's email address

**Example Request:**
```http
POST https://api.tinypass.com/api/v3/publisher/licensing/contract/redeem
Content-Type: application/x-www-form-urlencoded

api_token=YOUR_TOKEN
&aid=QiNgMM49pu
&contract_id=TMQ29SR23ZTA
&email=sarah.johnson@university.edu
```

**Note:** This may require the user to be a Piano ID user first. For most use cases, users redeem via the landing page themselves.

---

### 3. List Contract Users

**Endpoint:** `POST /publisher/licensing/contractUser/list`

**Purpose:** Get all users in a site license contract

**Required Parameters:**
- `api_token` - Your API token
- `aid` - Application ID
- `contract_id` - The contract ID

**Optional Parameters:**
- `limit` - Number of results per page (default: 100)
- `offset` - Pagination offset (default: 0)

**Example Request:**
```http
POST https://api.tinypass.com/api/v3/publisher/licensing/contractUser/list
Content-Type: application/x-www-form-urlencoded

api_token=YOUR_TOKEN
&aid=QiNgMM49pu
&contract_id=TMQ29SR23ZTA
```

**Example Response:**
```json
{
  "code": 0,
  "ts": 1774464810,
  "limit": 100,
  "offset": 0,
  "total": 50,
  "count": 50,
  "ContractUserList": [
    {
      "contract_user_id": "CUMG693V0I2V",
      "status": "PENDING",
      "email": "sarah.johnson@university.edu",
      "first_name": "Sarah",
      "last_name": "Johnson"
    },
    {
      "contract_user_id": "CUUDZ6A1L57I",
      "status": "ACTIVE",
      "email": "michael.chen@university.edu",
      "first_name": "Michael",
      "last_name": "Chen"
    }
  ]
}
```

**Key Fields:**
- `contract_user_id` - Internal Piano identifier (required for deletion)
- `status` - User status: `PENDING`, `ACTIVE`, or `REVOKED`
- `total` - Total number of users in the contract

---

### 4. Remove User from Contract

**Endpoint:** `POST /publisher/licensing/contractUser/removeAndRevoke`

**Purpose:** Remove a user from the contract and revoke their access

**Required Parameters:**
- `api_token` - Your API token
- `aid` - Application ID
- `contract_id` - The contract ID
- `contract_user_id` - The user's contract ID (from list endpoint)

**Example Request:**
```http
POST https://api.tinypass.com/api/v3/publisher/licensing/contractUser/removeAndRevoke
Content-Type: application/x-www-form-urlencoded

api_token=YOUR_TOKEN
&aid=QiNgMM49pu
&contract_id=TMQ29SR23ZTA
&contract_user_id=CUMG693V0I2V
```

**What Happens:**
- User is removed from the contract
- Access is revoked immediately
- Piano sends "Invitation revoked" email to the user
- User can no longer redeem the contract

**Note:** This works for both `PENDING` and `ACTIVE` users.

---

## Common Workflows

### Workflow 1: Bulk User Upload

**Use Case:** Import a list of institutional users at the start of a semester

**Steps:**

1. **Prepare CSV file** with user data:
   ```csv
   email,first_name,last_name
   sarah.johnson@university.edu,Sarah,Johnson
   michael.chen@university.edu,Michael,Chen
   ```

2. **For each user, call:**
   - `POST /publisher/licensing/contractUser/create`

3. **Result:**
   - Users added to contract in PENDING status
   - Invitation emails sent automatically
   - Users can redeem via landing page

**Python Example:**
```python
import csv
import requests

API_TOKEN = 'your_token'
AID = 'QiNgMM49pu'
CONTRACT_ID = 'TMQ29SR23ZTA'
BASE_URL = 'https://api.tinypass.com/api/v3'

with open('users.csv', 'r') as f:
    reader = csv.DictReader(f)
    for user in reader:
        response = requests.post(
            f'{BASE_URL}/publisher/licensing/contractUser/create',
            data={
                'api_token': API_TOKEN,
                'aid': AID,
                'contract_id': CONTRACT_ID,
                'email': user['email'],
                'first_name': user['first_name'],
                'last_name': user['last_name']
            }
        )
        print(f"Added: {user['email']} - Status: {response.status_code}")
```

---

### Workflow 2: Bulk User Removal

**Use Case:** Remove all users at the end of a semester or license period

**Steps:**

1. **List all contract users:**
   - `POST /publisher/licensing/contractUser/list`
   - Extract `contract_user_id` for each user

2. **For each user, call:**
   - `POST /publisher/licensing/contractUser/removeAndRevoke`

3. **Result:**
   - All users removed from contract
   - Access revoked
   - Clean slate for next period

**Python Example:**
```python
# Step 1: List users
list_response = requests.post(
    f'{BASE_URL}/publisher/licensing/contractUser/list',
    data={
        'api_token': API_TOKEN,
        'aid': AID,
        'contract_id': CONTRACT_ID
    }
).json()

users = list_response.get('ContractUserList', [])

# Step 2: Delete each user
for user in users:
    requests.post(
        f'{BASE_URL}/publisher/licensing/contractUser/removeAndRevoke',
        data={
            'api_token': API_TOKEN,
            'aid': AID,
            'contract_id': CONTRACT_ID,
            'contract_user_id': user['contract_user_id']
        }
    )
    print(f"Removed: {user['email']}")
```

---

### Workflow 3: Sync with Institutional System

**Use Case:** Daily sync between university student database and Piano

**Steps:**

1. **Query your institutional database** for active students
2. **Call list endpoint** to get current Piano users
3. **Compare lists** to find:
   - New students (add to Piano)
   - Graduated students (remove from Piano)
4. **Execute changes** via API

**Pseudo-code:**
```python
# Get current students from university DB
current_students = university_db.get_active_students()

# Get current Piano users
piano_users = get_contract_users()

# Find differences
to_add = [s for s in current_students if s not in piano_users]
to_remove = [u for u in piano_users if u not in current_students]

# Add new students
for student in to_add:
    create_contract_user(student)

# Remove graduated students
for user in to_remove:
    remove_contract_user(user)
```

---

## API Examples

### cURL Examples

**Create User:**
```bash
curl -X POST https://api.tinypass.com/api/v3/publisher/licensing/contractUser/create \
  -d "api_token=YOUR_TOKEN" \
  -d "aid=QiNgMM49pu" \
  -d "contract_id=TMQ29SR23ZTA" \
  -d "email=student@university.edu" \
  -d "first_name=John" \
  -d "last_name=Doe"
```

**List Users:**
```bash
curl -X POST https://api.tinypass.com/api/v3/publisher/licensing/contractUser/list \
  -d "api_token=YOUR_TOKEN" \
  -d "aid=QiNgMM49pu" \
  -d "contract_id=TMQ29SR23ZTA"
```

**Remove User:**
```bash
curl -X POST https://api.tinypass.com/api/v3/publisher/licensing/contractUser/removeAndRevoke \
  -d "api_token=YOUR_TOKEN" \
  -d "aid=QiNgMM49pu" \
  -d "contract_id=TMQ29SR23ZTA" \
  -d "contract_user_id=CUMG693V0I2V"
```

---

### Postman Collection

Import the included `Piano_API_Postman_Collection.json` for ready-to-use API requests.

**Collection Variables:**
- `api_token` - Your API token
- `app_id` - Your application ID
- `contract_id` - Your contract ID

**Included Requests:**
1. Create Contract User
2. Redeem Contract Access
3. List Contract Users
4. Remove User from Contract

---

## Response Formats

### Success Response

All successful Piano API responses include:

```json
{
  "code": 0,
  "ts": 1774464810,
  ...
}
```

- `code: 0` - Success
- `ts` - Timestamp of the response

### Error Response

Error responses include an error code and message:

```json
{
  "code": 61023,
  "message": "Forbid action for redeemed contract user"
}
```

Common error codes:
- `61023` - Cannot remove active user (use removeAndRevoke instead)
- `401` - Invalid API token
- `404` - Contract not found

---

## Error Handling

### Rate Limiting

Piano APIs have rate limits. Best practices:

- ✅ Add delay between requests (0.1-0.2 seconds)
- ✅ Implement exponential backoff for 429 errors
- ✅ Process in batches for large operations

**Python Example:**
```python
import time

for user in users:
    create_contract_user(user)
    time.sleep(0.1)  # 10 requests/second
```

### Handling Duplicates

If you try to add a user who already exists:

```json
{
  "code": 0,
  "message": "User already exists in contract"
}
```

This is safe to ignore - the user is already in the contract.

### Network Errors

Always wrap API calls in try/catch:

```python
try:
    response = requests.post(endpoint, data=payload)
    response.raise_for_status()
    return response.json()
except requests.exceptions.RequestException as e:
    print(f"API Error: {e}")
    return {'error': str(e)}
```

---

## Best Practices

### 1. Security

- ✅ Never commit API tokens to version control
- ✅ Use environment variables or `.env` files
- ✅ Rotate tokens periodically
- ✅ Use HTTPS for all requests

### 2. Performance

- ✅ Batch operations when possible
- ✅ Cache contract user lists (refresh every 5-10 minutes)
- ✅ Use pagination for large datasets
- ✅ Implement rate limiting

### 3. User Experience

- ✅ Send invitation emails from Piano (automatic)
- ✅ Provide clear landing page for redemption
- ✅ Handle errors gracefully with user-friendly messages
- ✅ Log all API operations for auditing

### 4. Testing

- ✅ Test with small batches first (5-10 users)
- ✅ Use sandbox environment for development
- ✅ Verify emails are being sent
- ✅ Test removal/revocation before production

### 5. Monitoring

- ✅ Log all API responses
- ✅ Track success/failure rates
- ✅ Alert on high error rates
- ✅ Monitor user redemption rates

---

## Demo Implementation

See the included Python script for a complete working example:

**File:** `upload_users_to_piano.py`

**Features:**
- ✅ Bulk upload from CSV
- ✅ Bulk removal with confirmation
- ✅ Rate limiting
- ✅ Error handling
- ✅ Progress tracking
- ✅ Results logging

**Usage:**
```bash
# Upload users
python upload_users_to_piano.py

# Remove all users
python upload_users_to_piano.py --delete
```

**Configuration:**
- Uses `.env` file for credentials
- Easily configurable for different contracts
- Production-ready code

---

## API Reference Links

- **Piano API Documentation:** https://docs.piano.io/api/
- **Site Licensing Guide:** https://docs.piano.io/site-licensing/
- **Authentication:** https://docs.piano.io/api/#authentication

---

## Support

For API support:
- **Email:** support@piano.io
- **Documentation:** https://docs.piano.io/
- **Community:** https://community.piano.io/

---

## Appendix: Full Example Responses

### Create User - Full Response

```json
{
  "code": 0,
  "ts": 1774464810,
  "contract_user": {
    "contract_user_id": "CUMG693V0I2V",
    "contract_id": "TMQ29SR23ZTA",
    "status": "PENDING",
    "email": "sarah.johnson@university.edu",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "created": 1774464810,
    "updated": 1774464810
  }
}
```

### List Users - Full Response

```json
{
  "code": 0,
  "ts": 1774464810,
  "limit": 100,
  "offset": 0,
  "total": 50,
  "count": 50,
  "ContractUserList": [
    {
      "contract_user_id": "CUMG693V0I2V",
      "status": "PENDING",
      "email": "sarah.johnson@university.edu",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "created": 1774464810
    },
    {
      "contract_user_id": "CUUDZ6A1L57I",
      "status": "ACTIVE",
      "email": "michael.chen@university.edu",
      "first_name": "Michael",
      "last_name": "Chen",
      "created": 1774464805,
      "redeemed": 1774465000
    }
  ]
}
```

### Remove User - Full Response

```json
{
  "code": 0,
  "ts": 1774464810,
  "message": "User removed successfully",
  "contract_user_id": "CUMG693V0I2V"
}
```

---

**Last Updated:** March 2026
**Version:** 1.0
**Demo Site:** https://lakeview.pianodemo.com
