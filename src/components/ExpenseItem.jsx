import React from 'react';
import { DollarSign, Wrench, Fuel, Car as CarIcon, PaintBucket, CircleAlert, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const typeConfig = {
    'Car purchase': { icon: CarIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    'Paint work': { icon: PaintBucket, color: 'text-purple-600', bg: 'bg-purple-100' },
    'Repairs': { icon: Wrench, color: 'text-red-600', bg: 'bg-red-100' },
    'Maintenance': { icon: CircleAlert, color: 'text-orange-600', bg: 'bg-orange-100' },
    'Fuel': { icon: Fuel, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    'Other': { icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-100' }
};

export default function ExpenseItem({ expense, onEdit, onDelete }) {
    const config = typeConfig[expense.type] || typeConfig['Other'];
    const Icon = config.icon;
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group mb-4 relative">
            <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0">
                <div className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${config.bg} ${config.color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-slate-900">{expense.title}</h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                            {expense.type}
                        </span>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm text-slate-500">{new Date(expense.createdAt).toLocaleDateString()}</span>
                    </div>
                    {expense.description && (
                        <p className="text-sm text-slate-600 mt-2 italic border-l-2 border-slate-200 pl-2">{expense.description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 pr-8 sm:pr-10">
                <span className="text-xl font-bold text-slate-900">${Number(expense.price || 0).toLocaleString()}</span>
                {expense.image && (
                    <a href={expense.image} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-medium hover:underline flex items-center mt-1">
                        View Receipt
                    </a>
                )}
            </div>

            {/* Actions Menu */}
            <div className="absolute top-4 right-2 sm:right-4 h-full" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 sm:p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <MoreVertical className="h-5 w-5" />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-10 w-36 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-10 py-1">
                        <button
                            onClick={onEdit}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                        >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
