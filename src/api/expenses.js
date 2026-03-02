import { client } from './client';

export const expensesApi = {
    getByCarId: async (carId) => {
        const { data } = await client.get(`/cars/${carId}/expenses`);
        return data;
    },
    createForCar: async (carId, expenseData) => {
        const { data } = await client.post(`/cars/${carId}/expenses`, expenseData);
        return data;
    },
    update: async (id, expenseData) => {
        const { data } = await client.put(`/expenses/${id}`, expenseData);
        return data;
    },
    delete: async (id) => {
        const { data } = await client.delete(`/expenses/${id}`);
        return data;
    }
};
