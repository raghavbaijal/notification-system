import requests
import json

# ==========================================
# 1. FILL IN YOUR PERSONAL DETAILS HERE
# ==========================================
MY_EMAIL = "your_email@abc.edu"
MY_NAME = "Your Name"
MY_MOBILE = "9999999999"
MY_GITHUB = "your_github_username"
MY_ROLL_NO = "your_roll_number"
MY_ACCESS_CODE = "THE_CODE_FROM_YOUR_EMAIL"

# ==========================================
# 2. DO NOT CHANGE BELOW THIS LINE
# ==========================================
BASE_URL = "http://20.207.122.201/evaluation-service"

def main():
    print("Step 1: Registering...")
    reg_payload = {
        "email": MY_EMAIL,
        "name": MY_NAME,
        "mobileNo": MY_MOBILE,
        "githubUsername": MY_GITHUB,
        "rollNo": MY_ROLL_NO,
        "accessCode": MY_ACCESS_CODE
    }
    
    reg_res = requests.post(f"{BASE_URL}/register", json=reg_payload)
    if reg_res.status_code != 200:
        print(f"Registration Failed! ({reg_res.status_code})")
        print(reg_res.text)
        return
        
    creds = reg_res.json()
    client_id = creds.get("clientID")
    client_secret = creds.get("clientSecret")
    print(f"Success! Client ID: {client_id}")
    
    print("\nStep 2: Getting Auth Token...")
    auth_payload = {
        "email": MY_EMAIL,
        "name": MY_NAME,
        "rollNo": MY_ROLL_NO,
        "accessCode": MY_ACCESS_CODE,
        "clientID": client_id,
        "clientSecret": client_secret
    }
    
    auth_res = requests.post(f"{BASE_URL}/auth", json=auth_payload)
    if auth_res.status_code != 200:
        print(f"Auth Failed! ({auth_res.status_code})")
        print(auth_res.text)
        return
        
    token_data = auth_res.json()
    access_token = token_data.get("access_token", token_data.get("token", "UNKNOWN"))
    
    print("\n" + "="*50)
    print("YOUR BEARER TOKEN IS:")
    print(access_token)
    print("="*50)
    print("Copy this token! You will need it for the frontend and backend.")

if __name__ == "__main__":
    main()
