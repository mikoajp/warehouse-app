import React, { useState } from 'react';
import { productApi } from '../services/api';
import { CreateProductRequest } from '../types/Product';
import LoadingSpinner from './LoadingSpinner';

interface AddProductModalProps {
    onClose: () => void;
    onProductAdded: () => void;
}

interface FormData {
    name: string;
    quantity: number;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onProductAdded }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        quantity: 0,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Nazwa produktu jest wymagana');
            return;
        }

        if (formData.quantity < 0) {
            setError('Ilość nie może być ujemna');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const requestData: CreateProductRequest = {
                name: formData.name.trim(),
                quantity: formData.quantity,
            };

            await productApi.createProduct(requestData);
            onProductAdded();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Błąd podczas dodawania produktu');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Math.max(0, parseInt(value) || 0) : value,
        }));
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Dodaj nowy produkt
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl transition-colors duration-200"
                        disabled={loading}
                    >
                        <span className="sr-only">Zamknij</span>
                        ×
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="text-red-800 text-sm">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nazwa produktu *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="np. Laptop Dell Inspiron"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            Początkowa ilość
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            step="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Ile sztuk produktu chcesz dodać do magazynu
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.name.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Dodawanie...
                                </div>
                            ) : (
                                'Dodaj produkt'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;