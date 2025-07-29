import React, { useState } from 'react';
import { Product } from '../types/Product';
import { useProducts } from '../hooks/useProducts';
import AddProductModal from './AddProductModal';
import AddStockModal from './AddStockModal';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ProductList: React.FC = () => {
    const { products, loading, error, refetch } = useProducts();
    const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
    const [showAddStock, setShowAddStock] = useState<number | null>(null);

    const handleProductAdded = () => {
        setShowAddProduct(false);
        refetch();
    };

    const handleStockAdded = () => {
        setShowAddStock(null);
        refetch();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={refetch} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        📦 Produkty magazynowe
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Zarządzaj stanem magazynowym produktów
                    </p>
                </div>
                <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Dodaj produkt
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {products.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {products.map((product: Product) => (
                            <li key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <div className="px-4 py-4 flex items-center justify-between">
                                    <div className="flex items-center min-w-0 flex-1">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-sm">
                          #{product.id}
                        </span>
                                            </div>
                                        </div>
                                        <div className="ml-4 min-w-0 flex-1">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                Stan magazynowy: <span className="font-medium ml-1">{product.currentStock}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        <button
                                            onClick={() => setShowAddStock(product.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Dodaj stan
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="px-4 py-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <div className="text-lg font-medium text-gray-900 mb-2">Brak produktów</div>
                        <div className="text-gray-500 mb-4">Nie masz jeszcze żadnych produktów w magazynie</div>
                        <button
                            onClick={() => setShowAddProduct(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Dodaj pierwszy produkt
                        </button>
                    </div>
                )}
            </div>

            {showAddProduct && (
                <AddProductModal
                    onClose={() => setShowAddProduct(false)}
                    onProductAdded={handleProductAdded}
                />
            )}

            {showAddStock !== null && (
                <AddStockModal
                    productId={showAddStock}
                    onClose={() => setShowAddStock(null)}
                    onStockAdded={handleStockAdded}
                />
            )}
        </div>
    );
};

export default ProductList;