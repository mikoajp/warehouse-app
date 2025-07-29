import axios, { AxiosResponse, AxiosError } from 'axios';
import { Product, ProductDetails, CreateProductRequest, AddStockRequest, ApiError } from '../types/Product';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const authApi = {
    validateToken: async (token: string): Promise<boolean> => {
        try {
            const response = await api.get('/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
};

export const productApi = {
    getProducts: async (): Promise<Product[]> => {
        const response: AxiosResponse<Product[]> = await api.get('/api/products');
        return response.data;
    },

    getProduct: async (id: number): Promise<ProductDetails> => {
        const response: AxiosResponse<ProductDetails> = await api.get(`/api/products/${id}`);
        return response.data;
    },

    createProduct: async (product: CreateProductRequest): Promise<Product> => {
        const response: AxiosResponse<Product> = await api.post('/api/products', product);
        return response.data;
    },

    addStock: async (id: number, request: AddStockRequest): Promise<Product> => {
        const response: AxiosResponse<Product> = await api.post(`/api/products/${id}/stock`, request);
        return response.data;
    },
};

export default api;