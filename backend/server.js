const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const connectDB = require('./db');
const Comparison = require('./models/Comparison');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes (important for future Frontend)
app.use(express.json());

// Connect to Database
connectDB();

// --- API Routes ---

/**
 * @route   GET /api/telemetry
 * @desc    Proxy to Python Data Engine. Fetches interpolated telemetry.
 * @access  Public
 */
app.get('/api/telemetry', async (req, res) => {
    try {
        // Forward query parameters to the Python service
        const { year, race, session, driver1, driver2 } = req.query;

        // Construct the Python service URL
        const pythonUrl = `${process.env.PYTHON_ENGINE_URL}/telemetry`;

        console.log(`Proxying request to: ${pythonUrl}`);

        const response = await axios.get(pythonUrl, {
            params: { year, race, session, driver1, driver2 }
        });

        // --- Auto-Save to MongoDB on Success ---
        // If we reached here, the Python engine returned 200 OK with data.
        try {
            const newComparison = new Comparison({
                title: `${year} ${race} - ${driver1} vs ${driver2}`, // Auto-generate title
                year,
                race,
                session,
                driver1,
                driver2
            });
            await newComparison.save();
            console.log("Auto-saved comparison to MongoDB.");
        } catch (dbErr) {
            console.error("Warning: Failed to auto-save to MongoDB:", dbErr.message);
            // We do NOT fail the request if saving fails, we just log it.
        }
        // ---------------------------------------

        res.json(response.data);
    } catch (err) {
        console.error('Error in /api/telemetry proxy:', err.message);
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(err.response.status).json(err.response.data);
        } else if (err.request) {
            // The request was made but no response was received
            res.status(503).json({ msg: 'Python Data Engine not reachable' });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ msg: 'Server Error' });
        }
    }
});

/**
 * @route   GET /api/stints
 * @desc    Proxy to Python Data Engine for Stint Data.
 * @access  Public
 */
app.get('/api/stints', async (req, res) => {
    try {
        const { year, race, session, driver1, driver2 } = req.query;
        // Construct the Python service URL
        const pythonUrl = `${process.env.PYTHON_ENGINE_URL}/stints`;

        console.log(`Proxying stint request to: ${pythonUrl}`);

        const response = await axios.get(pythonUrl, {
            params: { year, race, session, driver1, driver2 }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error in /api/stints proxy:', err.message);
        if (err.response) {
            res.status(err.response.status).json(err.response.data);
        } else if (err.request) {
            res.status(503).json({ msg: 'Python Data Engine not reachable' });
        } else {
            res.status(500).json({ msg: 'Server Error' });
        }
    }
});

/**
 * @route   POST /api/comparisons
 * @desc    Save a new comparison metadata
 * @access  Public
 */
app.post('/api/comparisons', async (req, res) => {
    try {
        const { title, year, race, session, driver1, driver2 } = req.body;

        const newComparison = new Comparison({
            title,
            year,
            race,
            session,
            driver1,
            driver2
        });

        const savedComparison = await newComparison.save();
        res.json(savedComparison);
    } catch (err) {
        console.error('Error saving comparison:', err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/comparisons
 * @desc    Get all saved comparisons
 * @access  Public
 */
app.get('/api/comparisons', async (req, res) => {
    try {
        const comparisons = await Comparison.find().sort({ createdAt: -1 });
        res.json(comparisons);
    } catch (err) {
        console.error('Error fetching comparisons:', err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
