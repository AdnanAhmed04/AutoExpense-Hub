import { client } from './client';

export const carApi = {
    getCars: async () => {
        const { data } = await client.get('/cars');
        return data; // returns [{ ...car, totalExpenses: 200 }]
    },
    getCarById: async (id) => {
        const { data } = await client.get(`/cars/${id}`);
        return data;
    },
    createCar: async (carData) => {
        const { data } = await client.post('/cars', carData);
        return data;
    },
    updateCar: async (id, updatedData) => {
        const { data } = await client.put(`/cars/${id}`, updatedData);
        return data;
    },
    deleteCar: async (id) => {
        const { data } = await client.delete(`/cars/${id}`);
        return data;
    }
};
