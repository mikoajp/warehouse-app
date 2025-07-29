import React, { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import { AddStockRequest, Product } from '../types/Product';
import LoadingSpinner from './LoadingSpinner';

interface AddStockModalProps {
    productId: number;
    onClose: () => void;
    onStockAdded: () => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ productId, onClose, onStockAdded }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [fetchingProduct, setFetchingProduct] = useState<boolean>(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setFetchingProduct(true);
                const productData = await productApi.getProduct(productId);
                setProduct(productData);
            } catch (err) {
                setError('Nie udało się załadować danych produktu');
            } finally {
                setFetchingProduct(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (quantity <= 0) {
            setError('Ilość musi być większa od 0');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const requestData: AddStockRequest = { quantity };
            await productApi.addStock(productId, requestData);
            onStockAdded();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Błąd podczas dodawania stanu magazynowego');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Dodaj stan magazynowy
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

                {fetchingProduct ? (
                    <div className="mb-4 p-4 bg-gray-50 rounded-md flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        <span className="text-gray-600">Ładowanie danych produktu...</span>
                    </div>
                ) : product ? (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="text-sm text-gray-600">Produkt:</div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Aktualny stan: <span className="font-medium ml-1">{product.currentStock}</span>
                        </div>
                    </div>
                ) : null}

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="text-red-800 text-sm">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            Ilość do dodania *
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            step="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            required
                            disabled={loading || fetchingProduct}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Podaj liczbę sztuk do dodania do magazynu
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
                            disabled={loading || fetchingProduct}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Dodawanie...
                                </div>
                            ) : (
                                'Dodaj stan'
                            )}
                        </button>
                    </div>
                </form>

                {product && quantity > 0 && !fetchingProduct && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <div className="text-sm text-blue-800 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Nowy stan będzie: <span className="font-medium ml-1">{product.currentStock + quantity}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddStockModal;