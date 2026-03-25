#!/usr/bin/env python3
"""
Piano Site Licensing API - Interactive Demo Script

This script demonstrates each core API endpoint with pauses between steps
for customer demonstrations.

Requirements:
    pip install requests python-dotenv

Usage:
    python demo_site_licensing_api.py

Controls:
    Press ENTER to proceed to next step
    Type 'skip' to skip remaining steps
    Type 'exit' to quit
"""

import requests
import json
import os
import sys
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Configuration
API_TOKEN = os.getenv('PIANO_API_TOKEN')
API_BASE_URL = os.getenv('PIANO_API_BASE_URL', 'https://api.tinypass.com/api/v3')
APP_ID = os.getenv('PIANO_APP_ID')
CONTRACT_ID = os.getenv('PIANO_CONTRACT_ID')

# Demo user - easy to identify in Piano Dashboard
DEMO_USER = {
    'email': 'markrdalton8@gmail.com',
    'first_name': 'Mark',
    'last_name': 'Dalton',
    'send_invitation': True  # Set to False to skip invitation email
}

# Track demo state
demo_state = {
    'contract_user_id': None,
    'created': False
}


def print_header(title):
    """Print a formatted section header."""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")


def print_json(data, title="Response"):
    """Pretty print JSON data."""
    print(f"\n📋 {title}:")
    print("-" * 70)
    print(json.dumps(data, indent=2))
    print("-" * 70)


def pause(message="Press ENTER to continue to next step..."):
    """Pause execution and wait for user input."""
    print(f"\n⏸️  {message}")
    user_input = input(">>> ").strip().lower()
    if user_input == 'exit':
        print("\n👋 Exiting demo. Goodbye!")
        sys.exit(0)
    elif user_input == 'skip':
        print("\n⏭️  Skipping to cleanup...")
        return 'skip'
    return None


def verify_config():
    """Verify all required configuration is present."""
    print_header("Configuration Check")

    print("Checking environment variables...")

    missing = []
    if not API_TOKEN:
        missing.append("PIANO_API_TOKEN")
    if not APP_ID:
        missing.append("PIANO_APP_ID")
    if not CONTRACT_ID:
        missing.append("PIANO_CONTRACT_ID")

    if missing:
        print(f"\n❌ ERROR: Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print(f"\n💡 Make sure your .env file contains all required values.")
        sys.exit(1)

    print(f"✅ API Base URL: {API_BASE_URL}")
    print(f"✅ App ID: {APP_ID}")
    print(f"✅ Contract ID: {CONTRACT_ID}")
    print(f"✅ API Token: {'*' * 20}{API_TOKEN[-4:]}")

    print(f"\n👤 Demo User:")
    print(f"   Email: {DEMO_USER['email']}")
    print(f"   Name: {DEMO_USER['first_name']} {DEMO_USER['last_name']}")


def step_1_create_user():
    """Step 1: Create a contract user."""
    print_header("Step 1: Create Contract User")

    print("📝 Endpoint: POST /publisher/licensing/contractUser/create")
    print(f"📧 Creating user: {DEMO_USER['email']}")

    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/create'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'email': DEMO_USER['email'],
        'first_name': DEMO_USER['first_name'],
        'last_name': DEMO_USER['last_name']
    }

    print("\n📤 Request:")
    print(f"   URL: {endpoint}")
    print(f"   Method: POST")
    print(f"   Parameters:")
    print(f"      - contract_id: {CONTRACT_ID}")
    print(f"      - email: {DEMO_USER['email']}")
    print(f"      - first_name: {DEMO_USER['first_name']}")
    print(f"      - last_name: {DEMO_USER['last_name']}")

    if pause() == 'skip':
        return 'skip'

    print("\n🚀 Executing API call...")

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        data = response.json()

        print_json(data, "API Response")

        if 'contract_user' in data:
            contract_user = data['contract_user']
            demo_state['contract_user_id'] = contract_user.get('contract_user_id')
            demo_state['created'] = True

            print(f"\n✅ SUCCESS!")
            print(f"   User created with status: {contract_user.get('status')}")
            print(f"   Contract User ID: {demo_state['contract_user_id']}")
            print(f"\n💡 What happened:")
            print(f"   • User added to contract in PENDING status")
            print(f"   • Piano sends invitation email to {DEMO_USER['email']}")
            print(f"   • User can redeem via landing page")
        else:
            print(f"\n⚠️  User may already exist in contract")
            print(f"   Response: {data}")

    except requests.exceptions.RequestException as e:
        print(f"\n❌ ERROR: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print_json(error_data, "Error Response")
            except:
                print(f"Response text: {e.response.text}")


def step_2_send_invitation():
    """Step 2: Send invitation email to the user."""
    print_header("Step 2: Send Invitation Email (Conditional)")

    if not demo_state['contract_user_id']:
        print("❌ Cannot send invitation - no contract_user_id available")
        print("   User may not have been created")
        return

    # Check if invitation should be sent
    if not DEMO_USER.get('send_invitation', True):
        print("⏭️  Skipping invitation email (send_invitation=False)")
        print("\n💡 In production:")
        print("   • You can conditionally send invitations based on user preferences")
        print("   • Example: newsletter_opt_in, email_preferences, etc.")
        print("   • This allows users to control communication preferences")
        return

    print("📝 Endpoint: POST /publisher/licensing/contractUser/invite")
    print(f"📧 Sending invitation email to: {DEMO_USER['email']}")
    print(f"   Contract User ID: {demo_state['contract_user_id']}")
    print(f"\n💡 Conditional Sending:")
    print(f"   • This demo sends the email because send_invitation=True")
    print(f"   • In production, check user preferences (e.g., newsletter_opt_in)")
    print(f"   • Only send to users who opted in to receive emails")

    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/invite'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'contract_user_id': demo_state['contract_user_id']
    }

    print("\n📤 Request:")
    print(f"   URL: {endpoint}")
    print(f"   Method: POST")
    print(f"   Parameters:")
    print(f"      - contract_id: {CONTRACT_ID}")
    print(f"      - contract_user_id: {demo_state['contract_user_id']}")

    if pause() == 'skip':
        return 'skip'

    print("\n🚀 Executing API call...")

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        data = response.json()

        print_json(data, "API Response")

        print(f"\n✅ SUCCESS!")
        print(f"   Invitation email sent to {DEMO_USER['email']}")

        print(f"\n💡 What happened:")
        print(f"   • Invitation email sent to user")
        print(f"   • Email contains link to redemption landing page")
        print(f"   • User can redeem access via landing page")

    except requests.exceptions.RequestException as e:
        print(f"\n❌ ERROR: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print_json(error_data, "Error Response")
            except:
                print(f"Response text: {e.response.text}")


def step_3_list_users():
    """Step 3: List all contract users."""
    print_header("Step 3: List Contract Users")

    print("📝 Endpoint: POST /publisher/licensing/contractUser/list")
    print(f"📊 Fetching all users in contract: {CONTRACT_ID}")

    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/list'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'limit': 10  # Show only first 10 for demo
    }

    print("\n📤 Request:")
    print(f"   URL: {endpoint}")
    print(f"   Method: POST")
    print(f"   Parameters:")
    print(f"      - contract_id: {CONTRACT_ID}")
    print(f"      - limit: 10 (showing first 10 users)")

    if pause() == 'skip':
        return 'skip'

    print("\n🚀 Executing API call...")

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        data = response.json()

        # Show abbreviated response for demo
        summary = {
            'total': data.get('total', 0),
            'count': data.get('count', 0),
            'showing': 'first 10 users'
        }

        users = data.get('ContractUserList', [])

        print(f"\n📊 Contract Summary:")
        print(f"   Total users in contract: {summary['total']}")
        print(f"   Users returned: {summary['count']}")

        if users:
            print(f"\n👥 Sample Users (first {min(3, len(users))}):")
            for i, user in enumerate(users[:3]):
                print(f"\n   User {i+1}:")
                print(f"      Email: {user.get('email')}")
                print(f"      Name: {user.get('first_name')} {user.get('last_name')}")
                print(f"      Status: {user.get('status')}")
                print(f"      Contract User ID: {user.get('contract_user_id')}")

        # Highlight our demo user
        demo_user_found = next((u for u in users if u.get('email') == DEMO_USER['email']), None)
        if demo_user_found:
            print(f"\n✅ Demo user found in contract!")
            print(f"   Email: {demo_user_found.get('email')}")
            print(f"   Status: {demo_user_found.get('status')}")
            demo_state['contract_user_id'] = demo_user_found.get('contract_user_id')

        print(f"\n💡 What this shows:")
        print(f"   • Total users in the contract")
        print(f"   • Each user's status (PENDING, ACTIVE, etc.)")
        print(f"   • Contract User IDs (needed for removal)")

        if pause("Press ENTER to see full API response...") != 'skip':
            print_json(data, "Full API Response")

    except requests.exceptions.RequestException as e:
        print(f"\n❌ ERROR: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print_json(error_data, "Error Response")
            except:
                print(f"Response text: {e.response.text}")


def step_4_redeem_access():
    """Step 4: Attempt to redeem access (may require Piano ID user)."""
    print_header("Step 4: Redeem Contract Access (Optional)")

    print("📝 Endpoint: POST /publisher/licensing/contract/redeem")
    print(f"🎫 Attempting to redeem access for: {DEMO_USER['email']}")

    print("\n⚠️  NOTE: This endpoint may require:")
    print("   • User to be a Piano ID user first")
    print("   • Or user to redeem via landing page")
    print("   • This step often fails for API-created users (expected)")

    if pause("Press ENTER to attempt redemption (or 'skip' to skip)...") == 'skip':
        return 'skip'

    endpoint = f'{API_BASE_URL}/publisher/licensing/contract/redeem'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'email': DEMO_USER['email']
    }

    print("\n🚀 Executing API call...")

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        data = response.json()

        print_json(data, "API Response")

        print(f"\n✅ Redemption succeeded!")
        print(f"   User should now have ACTIVE status")

    except requests.exceptions.RequestException as e:
        print(f"\n⚠️  Redemption failed (expected for demo users)")
        print(f"   Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print(f"   Error code: {error_data.get('code')}")
                print(f"   Message: {error_data.get('message', 'Unknown error')}")
            except:
                pass

        print(f"\n💡 In production:")
        print(f"   • Users typically redeem via the landing page")
        print(f"   • This creates their Piano ID account automatically")
        print(f"   • Admin redemption via API requires Piano ID user")


def step_5_remove_user():
    """Step 5: Remove the demo user from contract."""
    print_header("Step 5: Remove User from Contract")

    if not demo_state['contract_user_id']:
        print("❌ Cannot remove user - no contract_user_id available")
        print("   User may not have been created, or we couldn't find them")
        return

    print("📝 Endpoint: POST /publisher/licensing/contractUser/removeAndRevoke")
    print(f"🗑️  Removing user: {DEMO_USER['email']}")
    print(f"   Contract User ID: {demo_state['contract_user_id']}")

    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/removeAndRevoke'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID,
        'contract_user_id': demo_state['contract_user_id']
    }

    print("\n📤 Request:")
    print(f"   URL: {endpoint}")
    print(f"   Method: POST")
    print(f"   Parameters:")
    print(f"      - contract_id: {CONTRACT_ID}")
    print(f"      - contract_user_id: {demo_state['contract_user_id']}")

    if pause() == 'skip':
        return 'skip'

    print("\n🚀 Executing API call...")

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        data = response.json()

        print_json(data, "API Response")

        print(f"\n✅ SUCCESS!")
        print(f"   User removed from contract")

        print(f"\n💡 What happened:")
        print(f"   • User removed from contract")
        print(f"   • Access revoked immediately")
        print(f"   • 'Invitation revoked' email sent to user")
        print(f"   • User can no longer redeem this contract")

    except requests.exceptions.RequestException as e:
        print(f"\n❌ ERROR: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print_json(error_data, "Error Response")
            except:
                print(f"Response text: {e.response.text}")


def step_6_verify_removal():
    """Step 6: Verify user was removed by listing users again."""
    print_header("Step 6: Verify User Removal")

    print("📊 Checking if demo user is still in contract...")

    if pause() == 'skip':
        return 'skip'

    endpoint = f'{API_BASE_URL}/publisher/licensing/contractUser/list'

    payload = {
        'api_token': API_TOKEN,
        'aid': APP_ID,
        'contract_id': CONTRACT_ID
    }

    print("\n🚀 Fetching current contract users...")

    try:
        response = requests.post(endpoint, data=payload)
        response.raise_for_status()
        data = response.json()

        users = data.get('ContractUserList', [])
        demo_user_found = next((u for u in users if u.get('email') == DEMO_USER['email']), None)

        if demo_user_found:
            print(f"\n⚠️  Demo user still found in contract!")
            print(f"   This might indicate the removal didn't complete")
            print(f"   Status: {demo_user_found.get('status')}")
        else:
            print(f"\n✅ Demo user successfully removed!")
            print(f"   Email {DEMO_USER['email']} not found in contract")
            print(f"   Total users remaining: {data.get('total', 0)}")

    except requests.exceptions.RequestException as e:
        print(f"\n❌ ERROR: {e}")


def main():
    """Run the interactive demo."""
    print("\n" + "🎬" * 35)
    print("  Piano Site Licensing API - Interactive Demo")
    print("🎬" * 35)

    print("\nThis demo will walk through the core API endpoints:")
    print("  1️⃣  Create a contract user")
    print("  2️⃣  Send invitation email")
    print("  3️⃣  List all contract users")
    print("  4️⃣  Attempt to redeem access (optional)")
    print("  5️⃣  Remove the user from contract")
    print("  6️⃣  Verify removal")

    print("\n💡 Controls:")
    print("   • Press ENTER to proceed to next step")
    print("   • Type 'skip' to skip remaining steps and go to cleanup")
    print("   • Type 'exit' to quit immediately")

    if pause("\nPress ENTER to start the demo...") == 'skip':
        print("\nDemo cancelled.")
        return

    # Configuration check
    verify_config()

    if pause() == 'skip':
        print("\nDemo cancelled.")
        return

    # Step 1: Create user
    if step_1_create_user() == 'skip':
        print("\nSkipping to cleanup...")
    else:
        # Step 2: Send invitation
        if step_2_send_invitation() == 'skip':
            print("\nSkipping to cleanup...")
        else:
            # Step 3: List users
            if step_3_list_users() == 'skip':
                print("\nSkipping to cleanup...")
            else:
                # Step 4: Redeem access (optional)
                if step_4_redeem_access() == 'skip':
                    print("\nSkipping to cleanup...")
                # Don't skip cleanup even if step 4 is skipped

    # Step 5: Remove user (cleanup)
    step_5_remove_user()

    # Step 6: Verify removal
    step_6_verify_removal()

    # Demo complete
    print_header("Demo Complete!")

    print("✅ All API endpoints demonstrated:")
    print("   ✓ Create contract user")
    print("   ✓ Send invitation email")
    print("   ✓ List contract users")
    print("   ✓ Redeem access (attempted)")
    print("   ✓ Remove user from contract")
    print("   ✓ Verify removal")

    print(f"\n📝 Next Steps:")
    print(f"   • Check Piano Dashboard to verify changes")
    print(f"   • Use these endpoints for production integration")
    print(f"   • See PIANO_SITE_LICENSING_API_GUIDE.md for full docs")

    print(f"\n👋 Thanks for watching the demo!\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Demo interrupted by user (Ctrl+C)")
        print("👋 Goodbye!\n")
        sys.exit(0)
