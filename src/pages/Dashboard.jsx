import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/CarCard';
import Layout from '../components/Layout';
import { Plus, X, Car, Search, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { user } = useAuth();
    const { cars, addCar, getTotalExpenses } = useExpense();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [licensePlate, setLicensePlate] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const globalTotal = getTotalExpenses();

    const filteredAndSortedCars = cars
        .filter(car => {
            if (!searchQuery) return true;
            const searchTerm = searchQuery.toLowerCase();
            return (
                car.make.toLowerCase().includes(searchTerm) ||
                car.model.toLowerCase().includes(searchTerm) ||
                (car.licensePlate && car.licensePlate.toLowerCase().includes(searchTerm))
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'a-z':
                    return a.make.localeCompare(b.make);
                default:
                    return 0;
            }
        });

    const handleAddCar = (e) => {
        e.preventDefault();
        if (!make || !model || !year) return;

        addCar({ make, model, year, licensePlate });

        setMake('');
        setModel('');
        setYear('');
        setLicensePlate('');
        setIsAddModalOpen(false);
    };

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 pb-8 border-b border-slate-200 gap-6 lg:gap-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Garage</h1>
                    <p className="text-slate-500">Manage your vehicles and track their expenses.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="text-center sm:text-right w-full sm:w-auto">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Fleet Spend</p>
                        <p className="text-3xl font-extrabold text-blue-600">${globalTotal.toLocaleString()}</p>
                    </div>
                    <div className="w-full h-px sm:w-px sm:h-12 bg-slate-200 block"></div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-medium shadow-md shadow-slate-200 w-full sm:w-auto shrink-0"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Vehicle</span>
                    </button>
                </div>
            </div>

            {cars.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search cars by make, model, or plate..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 bg-white shadow-sm"
                        />
                    </div>

                    <div className="relative w-56 shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ArrowUpDown className="h-5 w-5 text-slate-400" />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 bg-white shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="newest">Sort with Date (Newest)</option>
                            <option value="oldest">Sort with Date (Oldest)</option>
                            <option value="a-z">Make (A-Z)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {cars.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-400">
                        <Car className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No cars added yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm">Get started by adding your first vehicle to track its related expenses.</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Your First Vehicle</span>
                    </button>
                </div>
            ) : filteredAndSortedCars.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No results found</h3>
                    <p className="text-slate-500 mb-2">We couldn't find any vehicles matching "{searchQuery}".</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors mt-2"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredAndSortedCars.map((car, index) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <CarCard car={car} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Car Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800">Add New Vehicle</h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddCar} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
                                        <input
                                            type="text"
                                            required
                                            value={make}
                                            onChange={(e) => setMake(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                            placeholder="e.g. Toyota"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                                        <input
                                            type="text"
                                            required
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                            placeholder="e.g. Camry"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                                        <input
                                            type="number"
                                            required
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                            placeholder="e.g. 2023"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">License Plate</label>
                                        <input
                                            type="text"
                                            value={licensePlate}
                                            onChange={(e) => setLicensePlate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-sm"
                                    >
                                        Save Vehicle
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
