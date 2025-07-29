export interface Product {
    id: number;
    name: string;
    currentStock: number;
}

export interface ProductDetails extends Product {
    stockMovements: StockMovement[];
}

export interface StockMovement {
    id: number;
    quantity: number;
    createdAt: string;
}

export interface CreateProductRequest {
    name: string;
    quantity: number;
}

export interface AddStockRequest {
    quantity: number;
}

export interface ApiError {
    error: string;
    message?: string;
    code?: number;
}