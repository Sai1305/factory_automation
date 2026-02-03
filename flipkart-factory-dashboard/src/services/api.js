import axios from 'axios';

// 1. Create the Axios Instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add Token Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// --- API FUNCTIONS ---

// User Auth
export const loginUser = async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
};

// Machines
export const getMachines = async () => {
    const response = await api.get('/machines');
    return response.data;
};

export const getMachineById = async (id) => {
    const response = await api.get(`/machines/${id}`);
    return response.data;
};

export const updateMachineStatus = async (id, status) => {
    const response = await api.put(`/machines/${id}`, { status });
    return response.data;
};

// Generic Update
export const updateMachine = async (id, data) => {
    const response = await api.put(`/machines/${id}`, data);
    return response.data;
};

//ADDED THIS TO FIX YOUR ERROR
export const sendCommand = async (id, command) => {
    // Maps 'start' -> 'Active' and 'stop' -> 'Idle' to match backend expectations
    const status = command.toLowerCase() === 'start' ? 'Active' : 'Idle';
    const response = await api.put(`/machines/${id}`, { status });
    return response.data;
};

// Alerts
export const getAlerts = async () => {
    const response = await api.get('/alerts');
    return response.data;
};

// Logs
export const getLogs = async () => {
    const response = await api.get('/logs');
    return response.data;
};

export default api;