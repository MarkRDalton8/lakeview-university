#!/usr/bin/env python3
"""
Piano Site Licensing API - Bulk User Upload Script

This script reads users from a CSV file and adds them to a Piano site license
using the Piano VX API.

Requirements:
    pip install requests python-dotenv

Usage:
    1. Copy .env.example to .env
    2. Fill in your Piano API credentials in .env
    3. Run: python upload_users_to_piano.py

Configuration:
    All configuration is read from .env file
"""

import csv
import requests
import json
import time
import os
from pathlib import Path
from typing import Dict, List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ============================================================================
# CONFIGURATION - All values loaded from .env file
# ============================================================================

# Piano API Configuration
API_TOKEN = os.getenv('PIANO_API_TOKEN')
API_BASE_URL = os.getenv('PIANO_API_BASE_URL', 'https://api.tinypass.com/api/v3')
APP_ID = os.getenv('PIANO_APP_ID')

# Site License Configuration
TERM_ID = os.getenv('PIANO_TERM_ID')

# File Configuration
CSV_FILE_PATH = os.getenv('CSV_FILE_PATH', 'users_to_upload.csv')

# Rate Limiting
RATE_LIMIT_DELAY = float(os.getenv('RATE_LIMIT_DELAY', '0.1'))

# ============================================================================
# API Functions
# ============================================================================

def create_or_update_user(user_data: Dict) -> Dict:
    """
    Create or update a user in Piano.

    Args:
        user_data: Dictionary containing user information

    Returns:
        API response as dictionary
    """
    endpoint = f'{API_BASE_URL}/publisher/user/create'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'email': user_data['email'],
        'first_name': user_data.get('first_name', ''),
        'last_name': user_data.get('last_name', ''),
        'uid': user_data.get('user_id', ''),
    }

    # Add custom fields
    if 'newsletter_opt_in' in user_data:
        payload['custom_field_newsletter_opt_in'] = user_data['newsletter_opt_in']

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e), 'user_email': user_data['email']}


def grant_term_to_user(user_uid: str, email: str) -> Dict:
    """
    Grant a term (site license) to a user.

    Args:
        user_uid: User's unique identifier
        email: User's email address

    Returns:
        API response as dictionary
    """
    endpoint = f'{API_BASE_URL}/publisher/term/grant'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'term_id': TERM_ID,
        'user_uid': user_uid,
    }

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e), 'user_email': email}


def read_users_from_csv(file_path: str) -> List[Dict]:
    """
    Read users from CSV file.

    Args:
        file_path: Path to CSV file

    Returns:
        List of user dictionaries
    """
    users = []
    with open(file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            users.append({
                'email': row['email'],
                'first_name': row['first_name'],
                'last_name': row['last_name'],
                'user_id': row['user_id'],
                'newsletter_opt_in': row['newsletter_opt_in'].lower() == 'true'
            })
    return users


# ============================================================================
# Main Script
# ============================================================================

def main():
    """Main execution function."""

    print("=" * 70)
    print("Piano Site Licensing - Bulk User Upload")
    print("=" * 70)
    print()

    # Validate configuration
    if not API_TOKEN:
        print("❌ ERROR: PIANO_API_TOKEN not set in .env file")
        print("   1. Copy .env.example to .env")
        print("   2. Add your Piano API token to .env")
        return

    if not APP_ID:
        print("❌ ERROR: PIANO_APP_ID not set in .env file")
        print("   Add your Piano Application ID to .env")
        return

    if not TERM_ID:
        print("❌ ERROR: PIANO_TERM_ID not set in .env file")
        print("   Add your Piano Term ID to .env")
        return

    print(f"✅ Configuration loaded from .env")
    print(f"   API Base URL: {API_BASE_URL}")
    print(f"   App ID: {APP_ID}")
    print(f"   Term ID: {TERM_ID}")
    print(f"   Rate Limit: {RATE_LIMIT_DELAY}s delay")
    print()

    # Read users from CSV
    print(f"📁 Reading users from: {CSV_FILE_PATH}")
    try:
        users = read_users_from_csv(CSV_FILE_PATH)
        print(f"✅ Found {len(users)} users to upload")
        print()
    except FileNotFoundError:
        print(f"❌ ERROR: File not found: {CSV_FILE_PATH}")
        return
    except Exception as e:
        print(f"❌ ERROR reading CSV: {e}")
        return

    # Process users
    results = {
        'success': [],
        'failed': []
    }

    print("🚀 Starting upload process...")
    print()

    for i, user in enumerate(users, 1):
        print(f"[{i}/{len(users)}] Processing: {user['email']}")

        # Step 1: Create/update user
        user_response = create_or_update_user(user)

        if 'error' in user_response:
            print(f"  ❌ Failed to create user: {user_response['error']}")
            results['failed'].append({
                'email': user['email'],
                'error': user_response['error']
            })
            continue

        print(f"  ✅ User created/updated")

        # Step 2: Grant term to user
        user_uid = user['user_id']  # or extract from user_response if Piano returns it

        term_response = grant_term_to_user(user_uid, user['email'])

        if 'error' in term_response:
            print(f"  ⚠️  Warning: Failed to grant term: {term_response['error']}")
            results['failed'].append({
                'email': user['email'],
                'error': f"Term grant failed: {term_response['error']}"
            })
        else:
            print(f"  ✅ Term granted")
            results['success'].append(user['email'])

        # Rate limiting
        time.sleep(RATE_LIMIT_DELAY)
        print()

    # Summary
    print("=" * 70)
    print("Upload Complete!")
    print("=" * 70)
    print(f"✅ Successful: {len(results['success'])}")
    print(f"❌ Failed: {len(results['failed'])}")
    print()

    if results['failed']:
        print("Failed users:")
        for failure in results['failed']:
            print(f"  - {failure['email']}: {failure['error']}")

    # Save results to file
    results_file = 'upload_results.json'
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n📄 Full results saved to: {results_file}")


if __name__ == '__main__':
    main()
