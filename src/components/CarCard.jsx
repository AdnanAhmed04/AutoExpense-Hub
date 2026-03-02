import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowRight } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export default function CarCard({ car }) {
    const navigate = useNavigate();
    const { getCarTotal } = useExpense();
    const total = getCarTotal(car.id);

    return (
        <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            onClick={() => navigate(`/car/${car.id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors text-blue-500">
                    <Car className="h-6 w-6" />
                </div>
                <div className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    {car.year}
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {car.make} {car.model}
            </h3>
            <p className="text-slate-500 text-sm mb-6 flex items-center mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                License: {car.licensePlate || 'N/A'}
            </p>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-slate-800">${total.toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}
