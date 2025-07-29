import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ProductList from './components/ProductList';
import LoadingSpinner from './components/LoadingSpinner';
import { authUtils } from './utils/auth';
import { authApi } from './services/api';

interface User {
    token: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = authUtils.getToken();
            if (token) {
                try {
                    const isValid = await authApi.validateToken(token);
                    if (isValid) {
                        setUser({ token });
                    } else {
                        authUtils.removeToken();
                    }
                } catch (error) {
                    authUtils.removeToken();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const handleLogin = async (token: string) => {
        try {
            const isValid = await authApi.validateToken(token);
            if (isValid) {
                authUtils.setToken(token);
                setUser({ token });
            } else {
                throw new Error('Invalid token');
            }
        } catch (error) {
            throw error;
        }
    };

    const handleLogout = () => {
        authUtils.removeToken();
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <div className="mt-4 text-gray-600">Inicjalizacja aplikacji...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-2xl mr-2">📦</span>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Magazyn Produktów
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500 hidden sm:block">
                                Zalogowany jako: <span className="font-medium text-gray-700">Admin</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Wyloguj
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <ProductList />
            </main>

            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-center text-sm text-gray-500">
                        <p>� 2024 Aplikacja Magazynowa - Symfony 7.3 + React 19 TypeScript</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;