import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [expenses, setExpenses] = useState({});

    useEffect(() => {
        if (user) {
            const userId = user.id || user._id;
            const storedCars = localStorage.getItem(`cars_${userId}`);
            const storedExpenses = localStorage.getItem(`expenses_${userId}`);

            if (storedCars) setCars(JSON.parse(storedCars));
            if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        } else {
            setCars([]);
            setExpenses({});
        }
    }, [user]);

    const saveCars = (newCars) => {
        setCars(newCars);
        if (user) {
            const userId = user.id || user._id;
            localStorage.setItem(`cars_${userId}`, JSON.stringify(newCars));
        }
    };

    const saveExpenses = (newExpenses) => {
        setExpenses(newExpenses);
        if (user) {
            const userId = user.id || user._id;
            localStorage.setItem(`expenses_${userId}`, JSON.stringify(newExpenses));
        }
    };

    const addCar = (carData) => {
        const newCar = {
            id: Date.now().toString(),
            ...carData,
            createdAt: new Date().toISOString()
        };
        saveCars([...cars, newCar]);
        saveExpenses({ ...expenses, [newCar.id]: [] });
        return newCar;
    };

    const addExpense = (carId, expenseData) => {
        const newExpense = {
            id: Date.now().toString(),
            carId,
            ...expenseData,
            createdAt: new Date().toISOString()
        };

        const carExpenses = expenses[carId] || [];
        saveExpenses({
            ...expenses,
            [carId]: [newExpense, ...carExpenses]
        });
        return newExpense;
    };

    const getCarExpenses = (carId) => {
        return expenses[carId] || [];
    };

    const getCarTotal = (carId) => {
        const carExpenses = expenses[carId] || [];
        return carExpenses.reduce((sum, exp) => sum + (Number(exp.price) || 0), 0);
    };

    const getTotalExpenses = () => {
        let total = 0;
        Object.values(expenses).forEach(carExp => {
            total += carExp.reduce((sum, exp) => sum + (Number(exp.price) || 0), 0);
        });
        return total;
    };

    const updateExpense = (carId, expenseId, updatedData) => {
        const carExpenses = expenses[carId] || [];
        const index = carExpenses.findIndex(e => e.id === expenseId);
        if (index === -1) return;

        const updatedExpense = {
            ...carExpenses[index],
            ...updatedData
        };

        const newCarExpenses = [...carExpenses];
        newCarExpenses[index] = updatedExpense;

        saveExpenses({
            ...expenses,
            [carId]: newCarExpenses
        });
        return updatedExpense;
    };

    const deleteExpense = (carId, expenseId) => {
        const carExpenses = expenses[carId] || [];
        const filteredExpenses = carExpenses.filter(e => e.id !== expenseId);

        saveExpenses({
            ...expenses,
            [carId]: filteredExpenses
        });
    };

    const updateCar = (carId, updatedData) => {
        const index = cars.findIndex(c => c.id === carId);
        if (index === -1) return;

        const updatedCar = { ...cars[index], ...updatedData };
        const newCars = [...cars];
        newCars[index] = updatedCar;
        saveCars(newCars);
        return updatedCar;
    };

    const deleteCar = (carId) => {
        const filteredCars = cars.filter(c => c.id !== carId);
        saveCars(filteredCars);

        const newExpenses = { ...expenses };
        delete newExpenses[carId];
        saveExpenses(newExpenses);
    };

    return (
        <ExpenseContext.Provider value={{
            cars,
            addCar,
            updateCar,
            deleteCar,
            expenses,
            addExpense,
            updateExpense,
            deleteExpense,
            getCarExpenses,
            getCarTotal,
            getTotalExpenses
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
