import { client, setToken, removeToken } from './client';

export const authApi = {
    register: async (credentials) => {
        const { data } = await client.post('/auth/register', credentials);
        if (data?.token) {
            setToken(data.token);
        }
        return data;
    },
    login: async (credentials) => {
        const { data } = await client.post('/auth/login', credentials);
        if (data?.token) {
            setToken(data.token);
        }
        return data;
    },
    me: async () => {
        const { data } = await client.get('/auth/me');
        return data;
    },
    logout: () => {
        removeToken();
    }
};
