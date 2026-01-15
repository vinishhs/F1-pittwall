import requests
import sys
import time

def test_telemetry_endpoint():
    url = "http://127.0.0.1:8000/telemetry"
    params = {
        "year": 2024,
        "race": "Silverstone",
        "session": "Q",
        "driver1": "VER",
        "driver2": "NOR"
    }

    print(f"Testing endpoint: {url} with params {params}")
    
    try:
        response = requests.get(url, params=params, timeout=60) # High timeout for first run (cache download)
    except requests.exceptions.ConnectionError:
        print("FAIL: Could not connect to server. Is it running?")
        sys.exit(1)

    if response.status_code != 200:
        print(f"FAIL: Status code {response.status_code}")
        print(f"Detail: {response.text}")
        sys.exit(1)

    data = response.json()

    # Checks
    try:
        distance = data['distance']
        d1 = data['d1']
        d2 = data['d2']

        print(f"Success: Response received.")
        
        # Check Lengths
        assert len(distance) == 500, f"Distance length is {len(distance)}, expected 500"
        assert len(d1['Speed']) == 500, f"Driver 1 Speed length is {len(d1['Speed'])}, expected 500"
        assert len(d2['Speed']) == 500, f"Driver 2 Speed length is {len(d2['Speed'])}, expected 500"
        
        print("PASS: Data arrays are exactly 500 points.")
        print("Phase 1 Verification Complete.")

    except KeyError as e:
        print(f"FAIL: Missing key in response: {e}")
        sys.exit(1)
    except AssertionError as e:
        print(f"FAIL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Small delay to ensure server reads this script run
    time.sleep(2) 
    test_telemetry_endpoint()
