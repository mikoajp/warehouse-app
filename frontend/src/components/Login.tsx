import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoginProps {
    onLogin: (token: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await onLogin(token.trim());
        } catch (err: any) {
            setError(`Nieprawidłowy token: ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-4xl">📦</div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Logowanie do magazynu
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Użyj tokenu: <span className="font-mono bg-gray-100 px-2 py-1 rounded">test-token-123</span>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="text-red-800 text-sm">{error}</div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="token" className="sr-only">
                            Access Token
                        </label>
                        <input
                            id="token"
                            name="token"
                            type="text"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Wprowadź access token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !token.trim()}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Logowanie...
                                </div>
                            ) : (
                                'Zaloguj się'
                            )}
                        </button>
                    </div>
                </form>


                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Informacje</span>
                        </div>
                    </div>

                    <div className="mt-4 text-center text-xs text-gray-500">
                        <p>🔒 Token testowy: <code className="bg-gray-100 px-1 rounded">test-token-123</code></p>
                        <p className="mt-1">📦 Aplikacja Magazynowa - Symfony + React</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;