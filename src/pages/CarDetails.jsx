import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import Layout from '../components/Layout';
import ExpenseItem from '../components/ExpenseItem';
import { ArrowLeft, Car, Plus, X, Receipt, SearchX, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPENSE_TYPES = [
    'Car purchase',
    'Paint work',
    'Repairs',
    'Maintenance',
    'Fuel',
    'Other'
];

export default function CarDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cars, getCarExpenses, getCarTotal, addExpense, updateExpense, deleteExpense, updateCar, deleteCar } = useExpense();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState(EXPENSE_TYPES[0]);
    const [image, setImage] = useState('');

    const [isCarModalOpen, setIsCarModalOpen] = useState(false);
    const [carMake, setCarMake] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carYear, setCarYear] = useState('');
    const [carLicense, setCarLicense] = useState('');

    const car = cars.find(c => c.id === id);

    if (!car) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <SearchX className="h-16 w-16 text-slate-300 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Vehicle Not Found</h2>
                    <p className="text-slate-500 mb-6">The vehicle you are looking for does not exist or has been removed.</p>
                    <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Garage
                    </button>
                </div>
            </Layout>
        );
    }

    const expenses = getCarExpenses(id);
    const total = getCarTotal(id);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!title) return;

        const expenseData = {
            title,
            description,
            price: Number(price) || 0,
            type,
            image
        };

        if (editingExpense) {
            updateExpense(id, editingExpense.id, expenseData);
        } else {
            addExpense(id, expenseData);
        }

        // Reset Form
        setEditingExpense(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setType(EXPENSE_TYPES[0]);
        setImage('');
        setIsModalOpen(false);
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setTitle(expense.title);
        setDescription(expense.description || '');
        setPrice(expense.price || '');
        setType(expense.type);
        setImage(expense.image || '');
        setIsModalOpen(true);
    };

    const handleDeleteExpense = (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(id, expenseId);
        }
    };

    const handleEditCarOpen = () => {
        setCarMake(car.make);
        setCarModel(car.model);
        setCarYear(car.year);
        setCarLicense(car.licensePlate || '');
        setIsCarModalOpen(true);
    };

    const handleUpdateCar = (e) => {
        e.preventDefault();
        if (!carMake || !carModel || !carYear) return;
        updateCar(id, {
            make: carMake,
            model: carModel,
            year: carYear,
            licensePlate: carLicense
        });
        setIsCarModalOpen(false);
    };

    const handleDeleteCar = () => {
        if (window.confirm('Are you sure you want to delete this vehicle and all its expenses?')) {
            deleteCar(id);
            navigate('/');
        }
    };

    return (
        <Layout>
            <div className="mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Garage
                </button>

                {/* Header Dashboard styling */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 translate-x-1/3 -translate-y-1/3 rounded-full blur-[80px] z-0"></div>

                    <div className="flex items-center space-x-6 relative z-10">
                        <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Car className="h-10 w-10" />
                        </div>
                        <div>
                            <div className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider inline-block mb-2">
                                {car.year} • {car.licensePlate || 'NO PLATE'}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">{car.make} {car.model}</h1>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-0 text-left md:text-right relative z-10 flex flex-col md:items-end">
                        <div className="flex gap-2 mb-4">
                            <button onClick={handleEditCarOpen} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 bg-white rounded-full transition-all shadow-sm border border-slate-100">
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={handleDeleteCar} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 bg-white rounded-full transition-all shadow-sm border border-slate-100">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Spent</p>
                            <p className="text-4xl font-extrabold text-blue-600">${total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Col: Expenses List */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Expense History</h2>
                        <button
                            onClick={() => {
                                setEditingExpense(null);
                                setTitle('');
                                setDescription('');
                                setPrice('');
                                setType(EXPENSE_TYPES[0]);
                                setImage('');
                                setIsModalOpen(true);
                            }}
                            className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all font-medium text-sm shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add Expense</span>
                        </button>
                    </div>

                    {expenses.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                            <div className="inline-flex h-16 w-16 bg-slate-50 rounded-full items-center justify-center text-slate-400 mb-4">
                                <Receipt className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No expenses yet</h3>
                            <p className="text-slate-500 mb-6 text-sm">Track your first expense for this vehicle.</p>
                            <button
                                onClick={() => {
                                    setEditingExpense(null);
                                    setTitle('');
                                    setDescription('');
                                    setPrice('');
                                    setType(EXPENSE_TYPES[0]);
                                    setImage('');
                                    setIsModalOpen(true);
                                }}
                                className="text-white bg-blue-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Add Your First Expense
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {expenses.map((expense) => (
                                <ExpenseItem
                                    key={expense.id}
                                    expense={expense}
                                    onEdit={() => handleEditExpense(expense)}
                                    onDelete={() => handleDeleteExpense(expense.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Expense Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                                <h3 className="text-lg font-bold text-slate-800">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 flex-1">
                                <form id="expense-form" onSubmit={handleAddExpense} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                            placeholder="e.g. New Tires"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Expense Type</label>
                                            <select
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 bg-white"
                                            >
                                                {EXPENSE_TYPES.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Amount / Price</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <DollarSign className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 resize-none h-24"
                                            placeholder="Add any extra details..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Receipt/Image URL</label>
                                        <input
                                            type="url"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="expense-form"
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm"
                                >
                                    {editingExpense ? 'Update Expense' : 'Save Expense'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Car Modal */}
            <AnimatePresence>
                {isCarModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsCarModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                                <h3 className="text-lg font-bold text-slate-800">Edit Vehicle</h3>
                                <button
                                    onClick={() => setIsCarModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 flex-1">
                                <form id="edit-car-form" onSubmit={handleUpdateCar} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Make <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                required
                                                value={carMake}
                                                onChange={(e) => setCarMake(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                                placeholder="e.g. Toyota"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Model <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                required
                                                value={carModel}
                                                onChange={(e) => setCarModel(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                                placeholder="e.g. Camry"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Year <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                required
                                                value={carYear}
                                                onChange={(e) => setCarYear(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                                placeholder="e.g. 2022"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">License Plate</label>
                                            <input
                                                type="text"
                                                value={carLicense}
                                                onChange={(e) => setCarLicense(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                                placeholder="e.g. XYZ-1234"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsCarModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="edit-car-form"
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm"
                                >
                                    Update Vehicle
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
