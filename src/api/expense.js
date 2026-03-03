import { client } from './client';

export const expenseApi = {
    getExpenses: async (carId) => {
        const { data } = await client.get(`/expenses/${carId}/expenses`); // Looking at BE/BE/routes/expenseSingleRoutes.js
        return data;
    },
    createExpense: async (carId, expenseData) => {
        // According to routes/expenseSingleRoutes.js: POST /api/expenses/:carId/expenses
        const { data } = await client.post(`/expenses/${carId}/expenses`, expenseData);
        return data;
    },
    updateExpense: async (id, updatedData) => {
        // According to routes/expenseSingleRoutes.js: PUT /api/expenses/:id
        const { data } = await client.put(`/expenses/${id}`, updatedData);
        return data;
    },
    deleteExpense: async (id) => {
        // According to routes/expenseSingleRoutes.js: DELETE /api/expenses/:id
        const { data } = await client.delete(`/expenses/${id}`);
        return data;
    }
};
