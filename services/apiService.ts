import { User } from '../types';

// --- SIMULATED API SERVICE ---
// In a real application, these functions would make network requests (e.g., using fetch)
// to a secure backend server, which would then interact with a database like MySQL.
// For this frontend-only project, we use localStorage to simulate a persistent database.

const apiDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const apiService = {
    
    /**
     * Registers a new user with their mobile, password, and personal details.
     */
    register: async (mobile: string, password: string, details: { name: string; village: string; district: string; }): Promise<User> => {
        await apiDelay(500); // Simulate network latency

        // Check if user already exists
        if (localStorage.getItem(`user_${mobile}`)) {
            throw new Error('This mobile number is already registered.');
        }

        const newUser: User = {
            mobile,
            password, // In a real app, the backend would hash this password
            ...details,
        };

        localStorage.setItem(`user_${mobile}`, JSON.stringify(newUser));
        return newUser;
    },

    /**
     * Logs in a user with their mobile and password.
     */
    login: async (mobile: string, password: string): Promise<User> => {
        await apiDelay(500); // Simulate network latency

        const userJSON = localStorage.getItem(`user_${mobile}`);
        if (!userJSON) {
            throw new Error('No account found with this mobile number.');
        }

        const user: User = JSON.parse(userJSON);
        if (user.password !== password) {
            throw new Error('Incorrect password. Please try again.');
        }

        return user;
    },

    /**
     * Retrieves the details of a logged-in user.
     */
    getUserDetails: async (mobile: string): Promise<User | null> => {
        await apiDelay(200); // Simulate network latency
        
        const userJSON = localStorage.getItem(`user_${mobile}`);
        if (!userJSON) {
            return null;
        }

        return JSON.parse(userJSON) as User;
    }
};
