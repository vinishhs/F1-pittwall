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

        # Helper function to get fastest lap telemetry
        def get_driver_telemetry(driver_code):
            try:
                laps = f1_session.laps.pick_driver(driver_code)
                if laps.empty:
                    raise ValueError(f"Driver {driver_code} found but no laps recorded.")
                fastest_lap = laps.pick_fastest()
                # add_distance() is crucial for the x-axis
                telemetry = fastest_lap.get_telemetry().add_distance()
                return telemetry
            except Exception as e:
                raise ValueError(f"Error fetching data for {driver_code}: {str(e)}")

        d1_tel = get_driver_telemetry(driver1)
        d2_tel = get_driver_telemetry(driver2)

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
            print(f"Delta calculated. Min: {np.min(delta)}, Max: {np.max(delta)}")
        except Exception as e:
            print(f"Delta Calculation Failed: {e}")
            delta = np.zeros(500)

        # Construct final JSON response
        response_data = {
            "distance": common_distance.tolist(),
            "delta": delta.tolist(),
            "d1": d1_interp,
            "d2": d2_interp
        }

        return JSONResponse(content=response_data)

    except ValueError as ve:
        # Client errors (e.g., driver not found)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Server errors (e.g., FastF1 failures)
        # In a real app, we might log the full stack trace
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
