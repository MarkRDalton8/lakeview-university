#!/usr/bin/env python3
"""
Piano Site Licensing API - Bulk User Upload Script

This script reads users from a CSV file and adds them to a Piano site license
using the Piano VX API.

Requirements:
    pip install requests python-dotenv

Usage:
    Upload users:    python upload_users_to_piano.py
    Delete all users: python upload_users_to_piano.py --delete

Configuration:
    All configuration is read from .env file
"""

import csv
import requests
import json
import time
import os
import argparse
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
CONTRACT_ID = os.getenv('PIANO_CONTRACT_ID')

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


def add_user_to_contract(email: str, first_name: str, last_name: str) -> Dict:
    """
    Add a user to a site license contract.

    Args:
        email: User's email address
        first_name: User's first name
        last_name: User's last name

    Returns:
        API response as dictionary
    """
    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/create'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'email': email,
        'first_name': first_name,
        'last_name': last_name,
    }

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e), 'user_email': email}


def redeem_contract_access(email: str) -> Dict:
    """
    Redeem access through the contract for a specific user.

    Args:
        email: User's email address

    Returns:
        API response as dictionary
    """
    endpoint = f'{API_BASE_URL}/publisher/licensing/contract/redeem'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'email': email,
    }

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e), 'user_email': email}


def list_contract_users() -> Dict:
    """
    List all users in a site license contract.

    Returns:
        API response as dictionary with list of users
    """
    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/list'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
    }

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}


def delete_user_from_contract(contract_user_id: str, email: str = None) -> Dict:
    """
    Remove and revoke a user from a site license contract.
    Uses removeAndRevoke endpoint which works for both pending and redeemed users.

    Args:
        contract_user_id: The contract user's public ID (required by Piano)
        email: User's email (for logging only)

    Returns:
        API response as dictionary
    """
    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/removeAndRevoke'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'contract_user_id': contract_user_id,
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
# Cleanup Functions
# ============================================================================

def delete_all_users():
    """Delete all users from the contract (for demo cleanup)."""

    print("=" * 70)
    print("Piano Site Licensing - DELETE ALL USERS")
    print("=" * 70)
    print()
    print("⚠️  WARNING: This will remove ALL users from the contract!")
    print(f"   Contract ID: {CONTRACT_ID}")
    print()

    confirm = input("Type 'DELETE' to confirm: ")
    if confirm != 'DELETE':
        print("❌ Cancelled.")
        return

    print()
    print("📋 Fetching list of contract users from Piano...")

    list_response = list_contract_users()

    if 'error' in list_response:
        print(f"❌ ERROR fetching user list: {list_response['error']}")
        return

    # Extract users from Piano response
    # Response structure may vary - adjust based on actual Piano API response
    contract_users = list_response.get('users', []) or list_response.get('data', [])

    if not contract_users:
        print("✅ No users found in contract. Nothing to delete.")
        return

    print(f"✅ Found {len(contract_users)} users in contract")
    print()

    results = {
        'deleted': [],
        'failed': [],
        'api_responses': []  # Capture actual API responses
    }

    print("🗑️  Starting deletion process...")
    print()

    for i, contract_user in enumerate(contract_users, 1):
        # Extract email and contract_user_id from Piano response
        email = contract_user.get('email', 'Unknown')
        contract_user_id = contract_user.get('contract_user_id') or contract_user.get('id')

        if not contract_user_id:
            print(f"[{i}/{len(contract_users)}] Skipping {email}: No contract_user_id found")
            results['failed'].append({
                'email': email,
                'error': 'No contract_user_id in response'
            })
            continue

        print(f"[{i}/{len(contract_users)}] Deleting: {email}")

        delete_response = delete_user_from_contract(contract_user_id, email)

        # Save the actual API response for debugging
        results['api_responses'].append({
            'email': email,
            'contract_user_id': contract_user_id,
            'response': delete_response
        })

        if 'error' in delete_response:
            print(f"  ❌ Failed: {delete_response['error']}")
            results['failed'].append({
                'email': email,
                'error': delete_response['error']
            })
        else:
            print(f"  ✅ Deleted")
            results['deleted'].append(email)

        time.sleep(RATE_LIMIT_DELAY)

    print()
    print("=" * 70)
    print("Deletion Complete!")
    print("=" * 70)
    print(f"✅ Deleted: {len(results['deleted'])}")
    print(f"❌ Failed: {len(results['failed'])}")
    print()

    if results['failed']:
        print("Failed deletions:")
        for failure in results['failed']:
            print(f"  - {failure['email']}: {failure['error']}")

    # Save results
    results_file = 'deletion_results.json'
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n📄 Full results saved to: {results_file}")


# ============================================================================
# Main Script
# ============================================================================

def main():
    """Main execution function."""

    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Piano Site Licensing - Bulk User Upload/Delete'
    )
    parser.add_argument(
        '--delete',
        action='store_true',
        help='Delete all users from contract (for demo cleanup)'
    )
    args = parser.parse_args()

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

    if not CONTRACT_ID:
        print("❌ ERROR: PIANO_CONTRACT_ID not set in .env file")
        print("   Add your Piano Site License Contract ID to .env")
        print("   Find it in: Piano Dashboard → Products → Licenses → [Your License] → Contracts")
        return

    print(f"✅ Configuration loaded from .env")
    print(f"   API Base URL: {API_BASE_URL}")
    print(f"   App ID: {APP_ID}")
    print(f"   Contract ID: {CONTRACT_ID}")
    print(f"   Rate Limit: {RATE_LIMIT_DELAY}s delay")
    print()

    # Handle delete mode
    if args.delete:
        delete_all_users()
        return

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

        # Step 1: Add user to contract
        contract_user_response = add_user_to_contract(
            email=user['email'],
            first_name=user['first_name'],
            last_name=user['last_name']
        )

        if 'error' in contract_user_response:
            print(f"  ❌ Failed to add user to contract: {contract_user_response['error']}")
            results['failed'].append({
                'email': user['email'],
                'error': contract_user_response['error']
            })
            continue

        print(f"  ✅ User added to contract")

        # Step 2: Redeem access for user
        redeem_response = redeem_contract_access(user['email'])

        if 'error' in redeem_response:
            print(f"  ⚠️  Warning: Failed to redeem access: {redeem_response['error']}")
            print(f"      User is in contract but in 'pending' status (for demo this is OK)")
            results['failed'].append({
                'email': user['email'],
                'error': f"Access redemption failed: {redeem_response['error']}"
            })
        else:
            print(f"  ✅ Access redeemed")
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
