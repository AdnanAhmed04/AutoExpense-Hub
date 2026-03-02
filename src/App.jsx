import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CarDetails from './pages/CarDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ExpenseProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/car/:id" element={
                            <ProtectedRoute>
                                <CarDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ExpenseProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
