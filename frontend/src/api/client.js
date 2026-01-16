import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 60000,
});

// Response interceptor for consistent error handling
client.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default client;
