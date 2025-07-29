import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/Product';
import { productApi } from '../services/api';

interface UseProductsReturn {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productApi.getProducts();
            setProducts(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Błąd podczas ładowania produktów';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    };
};