# F1 Virtual Pit Wall

A full-stack application for visualizing Formula 1 telemetry, lap data, and track dominance.

## 🚀 Setting Up & Running the Application

The project consists of three separate components that must be run concurrently: a Python Data Engine, a Node.js Backend, and a Vite/React Frontend.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (v3.9+)

---

### Step 1: Start the Python Data Engine

The Data Engine is responsible for querying the `fastf1` python library, processing raw telemetry, and performing heavy calculations.

1. Open a new terminal and navigate to the `data-engine` directory.
2. Ensure your virtual environment is activated (if you are using one, e.g., `..\venv\Scripts\activate` on Windows).
3. Run the FastAPI server:
   ```bash
   cd data-engine
   python main.py
   ```
*The Data Engine runs locally on `http://127.0.0.1:8000`.*

---

### Step 2: Start the Node.js Backend

The Backend Express server acts as a proxy between the React frontend and the Python data engine, and it handles saving analysis history to MongoDB.

*Note: The backend is configured for "Graceful Degradation." If it cannot connect to MongoDB, it will log a warning and run in "Stateless Mode," meaning live telemetry charts will work but the "Garage" history feature will be unavailable.*

1. Open a second terminal and navigate to the `backend` directory.
2. Install dependencies (if you haven't already):
   ```bash
   cd backend
   npm install
   ```
3. Start the server:
   ```bash
   npm run start
   # Alternative: node server.js
   ```
*The backend runs locally on port `5000`.*

---

### Step 3: Start the Vite Frontend

The React frontend provides the interactive dashboard and visualizations ("Phase 7" UI).

1. Open a third terminal and navigate to the `frontend` directory.
2. Install dependencies (if you haven't already):
   ```bash
   cd frontend
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173/`).

---

## 🛠️ Architecture Overview

- **Frontend**: React + Vite, Tailwind CSS, Plotly.js (`react-plotly.js`), Lucide React.
- **Backend**: Node.js, Express, Axios, Mongoose.
- **Data Engine**: Python, FastAPI, FastF1, Pandas, Numpy.
