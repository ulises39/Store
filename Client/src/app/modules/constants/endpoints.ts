export const BASE_URL = "http://localhost:5000/api/";

export enum PRODUCTS_ENDPOINTS {
    "PRODUCTS" = "products",
}

export enum BUGGY_ENDPOINTS {
    "BUGGY" = "buggy",
    "BAD_REQUEST" = "bad-request",
    "UNAUTHORIZED" = "unauthorized",    
    "NOT_FOUND" = "not-found",
    "SERVER_ERROR" = "server-error",
    "VALIDATION_ERROR" = "validation-error",
}