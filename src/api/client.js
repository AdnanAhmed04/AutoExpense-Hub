export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export async function client(endpoint, { body, ...customConfig } = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Something went wrong');
        }

        if (response.status === 204) {
            return { data: null, response };
        }

        const data = await response.json();
        return { data, response };
    } catch (error) {
        return Promise.reject(error);
    }
}

client.get = (endpoint, customConfig = {}) => client(endpoint, { ...customConfig, method: 'GET' });
client.post = (endpoint, body, customConfig = {}) => client(endpoint, { ...customConfig, body, method: 'POST' });
client.put = (endpoint, body, customConfig = {}) => client(endpoint, { ...customConfig, body, method: 'PUT' });
client.delete = (endpoint, customConfig = {}) => client(endpoint, { ...customConfig, method: 'DELETE' });
