// --- REAL API SERVICE ---
const API_URL = 'http://localhost:5000/api';

export const apiService = {
    register: async (username, password, details = {}) => {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, ...details })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Signup failed');
        }
        return await res.json();
    },

    login: async (username, password) => {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Login failed');
        }
        return await res.json(); // { token }
    },

    saveIteration: async (token, data) => {
        const res = await fetch(`${API_URL}/iteration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Save iteration failed');
        }
        return await res.json();
    },

    getUserIterations: async (token) => {
        const res = await fetch(`${API_URL}/iterations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Get iterations failed');
        }
        return await res.json();
    }
};