# Piano User Upload - Quick Start

Upload 50 users to your Piano site license in 3 steps.

## Quick Start

### 1. Install Dependencies
```bash
pip install requests python-dotenv
```

### 2. Configure Credentials
```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required fields in `.env`:**
- `PIANO_API_TOKEN` - Get from Piano Dashboard → Settings → API
- `PIANO_APP_ID` - Your Application ID (e.g., `QiNgMM49pu`)
- `PIANO_TERM_ID` - The site license term ID to grant

### 3. Run Upload
```bash
python upload_users_to_piano.py
```

That's it! ✅

## What Gets Uploaded

The script uploads all users from `users_to_upload.csv` (50 fake users included):
- Creates/updates user in Piano
- Grants site license term to each user
- Saves results to `upload_results.json`

## Verify in Piano

1. Go to Piano Dashboard → Users
2. Search for: `sarah.johnson@university.edu`
3. Check they have the term granted

## Update Configuration Anytime

Just edit `.env` file:
```bash
nano .env
```

Change any value and run the script again. No need to edit Python code!

## Files

- **`.env`** - Your configuration (not committed to git)
- **`.env.example`** - Template with all options
- **`users_to_upload.csv`** - 50 fake users
- **`upload_users_to_piano.py`** - Upload script
- **`upload_results.json`** - Results (created after run)

## Full Documentation

See `PIANO_API_SETUP.md` for:
- Detailed setup instructions
- Postman collection
- API documentation
- Troubleshooting guide
