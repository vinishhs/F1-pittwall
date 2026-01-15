const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
    console.log('--- Starting Phase 2 Verification ---');

    // 1. Test Proxy Endpoint
    try {
        console.log('\n1. Testing Proxy (/api/telemetry)...');
        const params = {
            year: 2024,
            race: 'Silverstone',
            session: 'Q',
            driver1: 'VER',
            driver2: 'NOR'
        };
        const response = await axios.get(`${BASE_URL}/telemetry`, { params });

        if (response.status === 200 && response.data.distance) {
            console.log('PASS: Proxy returned data.');
            console.log(`PASS: Data points: ${response.data.distance.length}`);
        } else {
            console.error('FAIL: Invalid proxy response');
        }
    } catch (error) {
        console.error('FAIL: Proxy test failed:', error.message);
    }

    // 2. Test POST Comparison
    let savedId;
    const dummyComparison = {
        title: 'Verification Test',
        year: 2024,
        race: 'Silverstone',
        session: 'Q',
        driver1: 'VER',
        driver2: 'NOR'
    };

    try {
        console.log('\n2. Testing Database Save (/api/comparisons)...');
        const response = await axios.post(`${BASE_URL}/comparisons`, dummyComparison);

        if (response.status === 200 && response.data._id) {
            savedId = response.data._id;
            console.log(`PASS: Saved comparison with ID: ${savedId}`);
        } else {
            console.error('FAIL: Save did not return ID');
        }
    } catch (error) {
        console.error('FAIL: Database POST failed:', error.message);
    }

    // 3. Test GET Comparisons
    try {
        console.log('\n3. Testing Database Retrieve (/api/comparisons)...');
        const response = await axios.get(`${BASE_URL}/comparisons`);

        if (response.status === 200 && Array.isArray(response.data)) {
            const found = response.data.find(c => c._id === savedId);
            if (found) {
                console.log('PASS: Retreived saved comparison from list.');
            } else {
                console.error('FAIL: Saved comparison not found in list.');
            }
            console.log(`Total comparisons: ${response.data.length}`);
        } else {
            console.error('FAIL: GET endpoint did not return array');
        }
    } catch (error) {
        console.error('FAIL: Database GET failed:', error.message);
    }

    console.log('\n--- Verification Complete ---');
};

runTests();
