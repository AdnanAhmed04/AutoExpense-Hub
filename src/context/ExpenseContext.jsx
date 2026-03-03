import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { carsApi } from '../api/cars';
import { expensesApi } from '../api/expenses';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch all cars for the user
    const fetchCars = useCallback(async () => {
        if (!user) {
            setCars([]);
            setExpenses({});
            return;
        }

        try {
            setLoading(true);
            const data = await carsApi.getAll();
            setCars(data);

            // Note: The backend getCars implementation attaches `totalExpenses` to each car object.
        } catch (error) {
            console.error('Failed to fetch cars:', error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    const addCar = async (carData) => {
        try {
            const newCar = await carsApi.create(carData);
            setCars(prev => [...prev, newCar]);
            setExpenses(prev => ({ ...prev, [newCar._id]: [] }));
            return newCar;
        } catch (error) {
            console.error('Failed to add car:', error);
            throw error;
        }
    };

    const updateCar = async (carId, updatedData) => {
        try {
            const updatedCar = await carsApi.update(carId, updatedData);
            setCars(prev => prev.map(c => c._id === carId ? updatedCar : c));
            return updatedCar;
        } catch (error) {
            console.error('Failed to update car:', error);
            throw error;
        }
    };

    const deleteCar = async (carId) => {
        try {
            await carsApi.delete(carId);
            setCars(prev => prev.filter(c => c._id !== carId));

            setExpenses(prev => {
                const newExp = { ...prev };
                delete newExp[carId];
                return newExp;
            });
        } catch (error) {
            console.error('Failed to delete car:', error);
            throw error;
        }
    };

    // Note: To fetch expenses lazily or all at once? The current UI fetches on CarDetails.
    // We will fetch upon request or keep them cached if already fetched.
    const fetchCarExpenses = async (carId) => {
        if (!user) return [];
        try {
            const data = await expensesApi.getByCarId(carId);
            setExpenses(prev => ({
                ...prev,
                [carId]: data
            }));
            return data;
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
            return [];
        }
    };

    const getCarExpenses = (carId) => {
        return expenses[carId] || [];
    };

    const addExpense = async (carId, expenseData) => {
        try {
            const newExpense = await expensesApi.createForCar(carId, expenseData);
            setExpenses(prev => {
                const carExps = prev[carId] || [];
                return {
                    ...prev,
                    [carId]: [newExpense, ...carExps]
                };
            });
            // Also need to trigger a refetch of cars to update the global `totalExpenses` count.
            fetchCars();
            return newExpense;
        } catch (error) {
            console.error('Failed to add expense:', error);
            throw error;
        }
    };

    const updateExpense = async (carId, expenseId, updatedData) => {
        try {
            const updatedExp = await expensesApi.update(expenseId, updatedData);
            setExpenses(prev => {
                const carExps = prev[carId] || [];
                return {
                    ...prev,
                    [carId]: carExps.map(e => e._id === expenseId ? updatedExp : e)
                };
            });
            fetchCars();
            return updatedExp;
        } catch (error) {
            console.error('Failed to update expense:', error);
            throw error;
        }
    };

    const deleteExpense = async (carId, expenseId) => {
        try {
            await expensesApi.delete(expenseId);
            setExpenses(prev => {
                const carExps = prev[carId] || [];
                return {
                    ...prev,
                    [carId]: carExps.filter(e => e._id !== expenseId)
                };
            });
            fetchCars();
        } catch (error) {
            console.error('Failed to delete expense:', error);
            throw error;
        }
    };

    // Calculate totals based on the `totalExpenses` field returned by `getCars`
    const getCarTotal = (carId) => {
        const car = cars.find(c => c._id === carId);
        return car ? (car.totalExpenses || 0) : 0;
    };

    const getTotalExpenses = () => {
        return cars.reduce((sum, car) => sum + (car.totalExpenses || 0), 0);
    };

    return (
        <ExpenseContext.Provider value={{
            cars,
            addCar,
            updateCar,
            deleteCar,
            expenses,
            fetchCarExpenses,
            addExpense,
            updateExpense,
            deleteExpense,
            getCarExpenses,
            getCarTotal,
            getTotalExpenses,
            loading
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
