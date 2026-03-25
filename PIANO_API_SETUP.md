# Piano Site Licensing API - User Upload Guide

This guide covers uploading users to Piano site licenses using both Python and Postman.

## Files Created

- **`users_to_upload.csv`** - 50 fake users with email, name, user ID, and newsletter opt-in field
- **`upload_users_to_piano.py`** - Python script to bulk upload users
- **`Piano_API_Postman_Collection.json`** - Postman collection for Piano API calls

---

## Prerequisites

### 1. Get Your Piano API Credentials

From Piano Dashboard:
1. Go to **Settings** → **API**
2. Generate an API token (if you don't have one)
3. Copy your **API Token**
4. Note your **Application ID (AID)** - for Lakeview it's `QiNgMM49pu`

### 2. Get Your Contract ID

The Contract ID represents your site license contract:
1. Go to **Products** → **Licenses** in Piano Dashboard
2. Click on your Site License
3. Go to the **Contracts** tab
4. Click on your contract
5. Copy the **Contract ID** from the URL or contract details (e.g., `CON123ABC`)

---

## Option 1: Python Script (Recommended for Bulk Upload)

### Setup

1. **Install Python dependencies:**
   ```bash
   pip install requests python-dotenv
   ```

2. **Configure your credentials:**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your credentials
   # Use your favorite text editor (nano, vim, VS Code, etc.)
   nano .env
   ```

   **Required values in `.env`:**
   ```bash
   PIANO_API_TOKEN=your_api_token_here
   PIANO_APP_ID=QiNgMM49pu
   PIANO_CONTRACT_ID=your_contract_id_here
   ```

   **Optional values (with defaults):**
   ```bash
   PIANO_API_BASE_URL=https://api.tinypass.com/api/v3
   CSV_FILE_PATH=users_to_upload.csv
   RATE_LIMIT_DELAY=0.1
   ```

3. **Verify CSV file:**
   - Make sure `users_to_upload.csv` is in the same directory
   - Check the CSV format matches your Piano custom fields

**Note:** The `.env` file is automatically ignored by git (in `.gitignore`) so your credentials won't be committed.

### Run the Script

```bash
python upload_users_to_piano.py
```

### Expected Output

```
======================================================================
Piano Site Licensing - Bulk User Upload
======================================================================

📁 Reading users from: users_to_upload.csv
✅ Found 50 users to upload

🚀 Starting upload process...

[1/50] Processing: sarah.johnson@university.edu
  ✅ User created/updated
  ✅ Term granted

[2/50] Processing: michael.chen@university.edu
  ✅ User created/updated
  ✅ Term granted

...

======================================================================
Upload Complete!
======================================================================
✅ Successful: 48
❌ Failed: 2

📄 Full results saved to: upload_results.json
```

### What the Script Does

1. **Reads CSV file** with user data
2. **Adds each user to the site license contract** via `/publisher/licensing/contractUser/create`
3. **Redeems access for each user** via `/publisher/licensing/contract/redeem`
4. **Handles rate limiting** (0.1s delay between requests)
5. **Logs results** to `upload_results.json`

**Note:** This uses the correct Piano Site Licensing API endpoints, not the generic term grant endpoints.

### Customizing the Script

**Add more custom fields:**
```python
payload['custom_field_department'] = user_data.get('department', '')
payload['custom_field_student_id'] = user_data.get('student_id', '')
```

**Adjust rate limiting:**
```python
RATE_LIMIT_DELAY = 0.2  # Slower (5 requests/sec)
```

---

## Option 2: Postman (Good for Testing/Single Users)

### Setup Postman

1. **Import the collection:**
   - Open Postman
   - Click **Import**
   - Select `Piano_API_Postman_Collection.json`

2. **Configure collection variables:**
   - Click on the **Piano Site Licensing API** collection
   - Go to **Variables** tab
   - Update these values:
     - `api_token` → Your Piano API token
     - `app_id` → `QiNgMM49pu` (or your AID)
     - `term_id` → Your term ID (e.g., `TMX123ABC`)

### Using the Collection

The collection includes 6 requests for site licensing:

#### 1️⃣ Create User
- **Endpoint:** `POST /publisher/user/create`
- **What it does:** Creates or updates a user in Piano
- **Body parameters:**
  - `email` - User's email (required)
  - `first_name` - First name
  - `last_name` - Last name
  - `uid` - Your internal user ID
  - `custom_field_newsletter_opt_in` - Custom field (true/false)

**To test:**
1. Select "1. Create User" request
2. Click **Body** tab
3. Update the user details
4. Click **Send**

**Expected response:**
```json
{
  "user": {
    "uid": "USR001",
    "email": "sarah.johnson@university.edu",
    "first_name": "Sarah",
    "last_name": "Johnson"
  }
}
```

#### 2️⃣ Grant Term to User
- **Endpoint:** `POST /publisher/term/grant`
- **What it does:** Grants site license access to a user
- **Body parameters:**
  - `term_id` - Your site license term ID
  - `user_uid` - The user's UID

**To test:**
1. First create the user (request #1)
2. Select "2. Grant Term to User"
3. Update `user_uid` to match the user you created
4. Click **Send**

**Expected response:**
```json
{
  "access_id": "ABC123XYZ",
  "granted": true
}
```

#### 3️⃣ Get User by Email
- **Endpoint:** `POST /publisher/user/get`
- **What it does:** Retrieves user details
- **Use case:** Verify user was created correctly

#### 4️⃣ List User Access
- **Endpoint:** `POST /publisher/user/access/list`
- **What it does:** Shows all active terms/access for a user
- **Use case:** Verify the term was granted

#### 5️⃣ Revoke Term from User
- **Endpoint:** `POST /publisher/term/revoke`
- **What it does:** Removes site license access from a user
- **Use case:** Remove users from site license

---

## Bulk Upload in Postman (Using Collection Runner)

You can also bulk upload using Postman's Collection Runner with the CSV:

1. **Prepare CSV for Postman:**
   - Keep the same `users_to_upload.csv` format

2. **Use Collection Runner:**
   - Click **Collections** → **Piano Site Licensing API**
   - Click **Run**
   - Click **Select File** and choose `users_to_upload.csv`
   - Select "1. Create User" request
   - Map CSV columns to request parameters
   - Click **Run Piano Site Licensing API**

3. **Postman will:**
   - Run the request for each row in the CSV
   - Show success/failure for each user

---

## Troubleshooting

### "Invalid API token" error
- Verify your token is correct in Piano Dashboard → Settings → API
- Make sure you're using the right environment (sandbox vs. production)

### "Term not found" error
- Check your Term ID in Piano Dashboard → Products → Terms
- Ensure the term is active

### "User already exists" error
- This is OK! The API will update the existing user
- The term will still be granted

### Rate limiting errors (429)
- Increase `RATE_LIMIT_DELAY` in the Python script
- Add delays in Postman Collection Runner

### Custom field not saving
- Verify custom field name in Piano Dashboard → Settings → Custom Fields
- Field name in API must be: `custom_field_` + field name
- Example: if field is `newsletter_opt_in`, use `custom_field_newsletter_opt_in`

---

## Piano API Documentation

- **API Reference:** https://docs.piano.io/api/
- **User Management:** `/publisher/user/create`, `/publisher/user/get`
- **Term Management:** `/publisher/term/grant`, `/publisher/term/revoke`
- **Authentication:** All requests require `api_token` and `aid` parameters

---

## Next Steps

1. **Test with one user first:**
   - Use Postman to create one user and grant the term
   - Verify it works in Piano Dashboard

2. **Run bulk upload:**
   - Use the Python script for all 50 users
   - Check `upload_results.json` for any failures

3. **Verify in Piano:**
   - Go to Piano Dashboard → Users
   - Search for one of the uploaded emails
   - Check they have the term granted

4. **Test on Lakeview site:**
   - Log in with one of the test users
   - Visit a gated page (computational-neuroscience)
   - Verify full access is granted ✓

---

## Sample CSV Format

```csv
email,first_name,last_name,user_id,newsletter_opt_in
sarah.johnson@university.edu,Sarah,Johnson,USR001,true
michael.chen@university.edu,Michael,Chen,USR002,false
```

**Notes:**
- Email is required
- Other fields are optional but recommended
- Custom fields (like newsletter_opt_in) must be defined in Piano Dashboard first
- Boolean values should be `true` or `false` (lowercase)
