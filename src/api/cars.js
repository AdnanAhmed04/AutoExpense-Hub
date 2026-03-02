import { client } from './client';

export const carsApi = {
    getAll: async () => {
        const { data } = await client.get('/cars');
        return data;
    },
    getById: async (id) => {
        const { data } = await client.get(`/cars/${id}`);
        return data;
    },
    create: async (carData) => {
        const { data } = await client.post('/cars', carData);
        return data;
    },
    update: async (id, carData) => {
        const { data } = await client.put(`/cars/${id}`, carData);
        return data;
    },
    delete: async (id) => {
        const { data } = await client.delete(`/cars/${id}`);
        return data;
    }
};
