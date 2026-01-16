import fastf1
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
import uvicorn
import os

# Create cache directory if it doesn't exist
if not os.path.exists('./cache'):
    os.makedirs('./cache')

# Enable FastF1 cache
fastf1.Cache.enable_cache('./cache')

app = FastAPI(title="F1 Virtual Pit Wall Data Engine")

@app.get("/telemetry")
async def get_telemetry(
    year: int = Query(..., description="Season Year"),
    race: str = Query(..., description="Race Name or Round Number"),
    session: str = Query("Q", description="Session Identifier (e.g., 'Q', 'R', 'FP1')"),
    driver1: str = Query(..., description="Three-letter identifier for Driver 1"),
    driver2: str = Query(..., description="Three-letter identifier for Driver 2")
):
    try:
        # Load the session
        f1_session = fastf1.get_session(year, race, session)
        f1_session.load()

        # Helper function to get fastest lap telemetry and lap time
        def get_driver_telemetry(driver_code):
            try:
                laps = f1_session.laps.pick_driver(driver_code)
                if laps.empty:
                    raise ValueError(f"Driver {driver_code} found but no laps recorded.")
                fastest_lap = laps.pick_fastest()
                
                # Format Lap Time
                # pandas Timedelta to string usually gives "0 days 00:01:25.123000"
                # We want "1:25.123"
                lap_time = fastest_lap['LapTime']
                # Convert to string, remove "0 days " if present
                lt_str = str(lap_time).split('days')[-1].strip()
                # If it has microseconds, slice to 3 decimals (MS.nnn)
                # Format is usually HH:MM:SS.mmmmmm or similar
                # We can be safe by taking the last section or formatting manually
                # str(lap_time) -> "0 days 00:01:27.452000"
                # split -> "00:01:27.452000"
                if '.' in lt_str:
                    main_part, ms_part = lt_str.rsplit('.', 1)
                    lt_str = f"{main_part}.{ms_part[:3]}"
                
                # Remove leading "00:" hours if present
                if lt_str.startswith("00:"):
                    lt_str = lt_str[3:]
                # Remove leading "0" from minutes if present (e.g. 01:27 -> 1:27)
                if lt_str.startswith("0"):
                    lt_str = lt_str[1:]

                # add_distance() is crucial for the x-axis
                telemetry = fastest_lap.get_telemetry().add_distance()
                return telemetry, lt_str
            except Exception as e:
                # Log error but don't crash main flow if one driver fails? 
                # Actually we should raise to alert user
                raise ValueError(f"Error fetching data for {driver_code}: {str(e)}")

        d1_tel, d1_best = get_driver_telemetry(driver1)
        d2_tel, d2_best = get_driver_telemetry(driver2)

        # Determine the maximum common distance
        # We take the minimum of the two total distances to ensure data exists for both
        max_dist = min(d1_tel['Distance'].max(), d2_tel['Distance'].max())

        # Create the common distance axis (500 points)
        common_distance = np.linspace(0, max_dist, 500)

        # Interpolation function
        def interpolate_telemetry(source_data):
            # We interpolate these columns
            columns_to_interp = ['Speed', 'Throttle', 'Brake', 'X', 'Y']
            result = {}
            
            # Ensure the source is sorted by distance
            source_sorted = source_data.sort_values('Distance')
            x_vals = source_sorted['Distance'].values
            
            # Interpolate Data Columns
            for col in columns_to_interp:
                y_vals = source_sorted[col].values
                interp_vals = np.interp(common_distance, x_vals, y_vals)
                result[col] = interp_vals.tolist()
            
            # Interpolate Time (convert to seconds first)
            # Time is a timedelta64[ns]
            time_seconds = source_sorted['Time'].dt.total_seconds().values
            result['Time'] = np.interp(common_distance, x_vals, time_seconds).tolist()
            
            return result

        d1_interp = interpolate_telemetry(d1_tel)
        d2_interp = interpolate_telemetry(d2_tel)

        # Calculate Delta (Driver 2 - Driver 1)
        # If D2 is ahead in time (larger value), it means they are BEHIND on track (slower).
        # Standard F1 Delta: Reference (D1) vs Target (D2). 
        # Positive Delta usually means Target is slower (behind).
        try:
            delta = np.array(d2_interp['Time']) - np.array(d1_interp['Time'])
            # print(f"Delta calculated. Min: {np.min(delta)}, Max: {np.max(delta)}")
        except Exception as e:
            print(f"Delta Calculation Failed: {e}")
            delta = np.zeros(500)

        # Construct final JSON response
        response_data = {
            "distance": common_distance.tolist(),
            "delta": delta.tolist(),
            "d1": d1_interp,
            "d2": d2_interp,
            "d1_best": d1_best,
            "d2_best": d2_best
        }

        return JSONResponse(content=response_data)

    except ValueError as ve:
        # Client errors (e.g., driver not found)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Server errors (e.g., FastF1 failures)
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/stints")
async def get_stints(
    year: int = Query(..., description="Season Year"),
    race: str = Query(..., description="Race Name or Round Number"),
    session: str = Query("Q", description="Session Identifier"),
    driver1: str = Query(..., description="Driver 1"),
    driver2: str = Query(..., description="Driver 2")
):
    try:
        f1_session = fastf1.get_session(year, race, session)
        f1_session.load()
        
        # Wrap the whole processing implementation in try-except to handle data issues (Qualy, messy data)
        try:
            laps = f1_session.laps.pick_drivers([driver1, driver2])
            if laps.empty:
                 return JSONResponse(content=[]) # Defensive: Return empty list on no data

            stints = []
            
            # Group by Driver and Stint
            # fastf1 'Stint' column is float, verify existence
            if 'Stint' not in laps.columns:
                 # Fallback if Stint column missing (rare in recent data)
                 return JSONResponse(content=[])

            for driver in [driver1, driver2]:
                driver_laps = laps.pick_driver(driver)
                if driver_laps.empty:
                    continue

                # Group by Stint
                for stint_id, stint_data in driver_laps.groupby('Stint'):
                    # Get Compound (take mode or first)
                    compound = stint_data['Compound'].mode()
                    if not compound.empty:
                        compound = compound.iloc[0]
                    else:
                        compound = "UNKNOWN"
                    
                    start_lap = int(stint_data['LapNumber'].min())
                    end_lap = int(stint_data['LapNumber'].max())
                    tyre_life = int(len(stint_data))

                    stints.append({
                        "Driver": driver,
                        "Stint": int(stint_id),
                        "Compound": compound,
                        "StartLap": start_lap,
                        "EndLap": end_lap,
                        "TyreLife": tyre_life
                    })

            return JSONResponse(content=stints)
            
        except Exception as inner_e:
            print(f"Processing Error in /stints: {inner_e}")
            # In case of pandas errors or data inconsistency, result safely with empty list
            return JSONResponse(content=[])

    except Exception as e:
        print(f"Stint Error: {e}")
        # Even session loading errors should probably just return empty for Stints to not break UI?
        # But 500 is okay if session loading fails generally, as telemetry would also fail.
        # Let's keep 500 for session loading failure, but [] for data parsing failure.
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
