import requests
import sys

def verify_upgrade():
    url = "http://127.0.0.1:8000/telemetry"
    params = {
        "year": 2024,
        "race": "Silverstone",
        "session": "Q",
        "driver1": "VER",
        "driver2": "NOR"
    }

    print(f"Verifying Upgrade: {url}")
    try:
        response = requests.get(url, params=params, timeout=30)
        data = response.json()
        
        # Check for new channels in d1 and d2
        for driver in ['d1', 'd2']:
            if 'Energy' not in data[driver]:
                print(f"FAIL: 'Energy' missing for {driver}")
                sys.exit(1)
            if 'DRS_Mapped' not in data[driver]:
                print(f"FAIL: 'DRS_Mapped' missing for {driver}")
                sys.exit(1)
            
            # Check length is 500
            if len(data[driver]['Energy']) != 500:
                print(f"FAIL: Energy length for {driver} is {len(data[driver]['Energy'])}, expected 500")
                sys.exit(1)
            
            # Check values are realistic
            energy_vals = data[driver]['Energy']
            if any(v < 0 or v > 100 for v in energy_vals):
                print(f"FAIL: Energy values out of range [0, 100]")
                sys.exit(1)
                
            print(f"PASS: {driver} has valid Energy and DRS_Mapped channels.")

        print("Upgrade Verification Successful: 2026 Channels are active and synchronized.")
    except Exception as e:
        print(f"Verification Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_upgrade()
