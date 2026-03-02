import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Car, Menu, X, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import carGif from '../ezgif-7ceba33fd30c7825_transparent.gif';


export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div
                            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none max-w-full"
                            onClick={() => navigate("/")}
                        >

                            <span className=" sm:text-lg lg:text-xl flex justify-center items-center sm:gap-3 min-w-0">


                                <img
                                    src={carGif}
                                    alt="AutoExpense animation"
                                    className="h-24 w-24 bg-transparent sm:h-32 sm:w-32 sm:h-16 lg:h-28 lg:w-28 object-contain shrink-0 "
                                />
                                <span className="lg:-ml-2 lg:mt-10">
                                    <i><b>AutoExpense Hub   </b></i>
                                </span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex items-center space-x-2 bg-slate-200 py-2 px-4 rounded-full">
                                <div className=" border border-slate-300 rounded-full p-1">
                                    <User className="h-4 w-4 text-slate-700" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg space-x-2 text-sm font-medium text-slate-600 hover:bg-blue-700 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Log Out</span>
                            </button>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-slate-500 hover:text-slate-700 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white absolute w-full shadow-lg">
                        <div className="px-4 pt-4 pb-6 space-y-4">
                            <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-lg">
                                <div className="bg-slate-300 rounded-full p-2">
                                    <User className="h-5 w-5 text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-slate-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
