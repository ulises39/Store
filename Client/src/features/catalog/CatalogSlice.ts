import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/modules/interfaces/Product";
import agent from "../../app/api/Agent";
import { CATALOG_STATES } from "./CatalogStates";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchAllProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.list();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data})
        }
    }
);

export const fetchSingleProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchSingleProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }
    }
);

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: CATALOG_STATES.IDLE
    }),
    reducers: {},
    extraReducers: (builder => {
        // Fetch All Products States
        builder.addCase(fetchAllProductsAsync.pending, (state) => {
            state.status = CATALOG_STATES.PendingFetchProducts;
        });
        builder.addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = CATALOG_STATES.IDLE;
            state.productsLoaded = true;
        });
        builder.addCase(fetchAllProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = CATALOG_STATES.IDLE;
        });

        // Fetch Single Product States
        builder.addCase(fetchSingleProductAsync.pending, (state) => {
            state.status = CATALOG_STATES.PendingFetchSingleProduct
        });
        builder.addCase(fetchSingleProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = CATALOG_STATES.IDLE;
        });
        builder.addCase(fetchSingleProductAsync.rejected, (state, action) => {
            state.status = CATALOG_STATES.IDLE;
            console.log(action);
        });

    })
});

export const productsSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);