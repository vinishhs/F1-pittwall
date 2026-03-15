import fastf1
import pandas as pd
import numpy as np

# Enable FastF1 cache
fastf1.Cache.enable_cache('./cache')

def calculate_pit_window(lap_times, lap_numbers, base_pace):
    if len(lap_times) < 3:
        return None
    
    # Use last 5 laps
    recent_times = lap_times[-5:]
    recent_laps = lap_numbers[-5:]
    
    if len(recent_times) < 3:
        return None
        
    x = np.array(recent_laps)
    y = np.array(recent_times)
    n = len(x)
    denom = (n * np.sum(x**2) - (np.sum(x))**2)
    if denom == 0: return None
    
    m = (n * np.sum(x*y) - np.sum(x)*np.sum(y)) / denom
    effective_m = max(m, 0.05) if m < 0.2 else m
    
    print(f"Calculated slope (last 5): {m}, Effective: {effective_m}")
    
    last_lap = x[-1]
    last_time = y[-1]
    win_start = None
    win_end = None
    
    for i in range(1, 40):
        curr_lap = last_lap + i
        pred_time = last_time + (effective_m * i)
        if win_start is None and pred_time >= (base_pace + 1.5):
            win_start = int(curr_lap)
        if win_end is None and pred_time >= (base_pace + 3.0):
            win_end = int(curr_lap)
            break
    
    if win_start and win_end:
        if win_start > (last_lap + 30): return None
        return {"PitWindowStart": win_start, "PitWindowEnd": win_end}
    return None

print("Loading session...")
session = fastf1.get_session(2023, 'Silverstone', 'R')
session.load()
laps = session.laps.pick_driver('HAM') # Try HAM for stint 1/2
print(f"Total laps for HAM: {len(laps)}")

for stint_id, stint_data in laps.groupby('Stint'):
    valid_laps = stint_data.dropna(subset=['LapTime'])
    if valid_laps.empty: continue
    
    lap_numbers = valid_laps['LapNumber'].tolist()
    lap_times = [t.total_seconds() for t in valid_laps['LapTime'].tolist()]
    base_pace = min(lap_times)
    
    print(f"Stint {stint_id}: {len(lap_times)} laps. Base Pace: {base_pace}")
    window = calculate_pit_window(lap_times, lap_numbers, base_pace)
    print(f"Window: {window}")
