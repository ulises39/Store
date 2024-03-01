import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/Agent";
import { MetaData } from "../../app/modules/interfaces/Pagination";
import { Product, ProductParams } from "../../app/modules/interfaces/Product";
import { RootState } from "../../app/store/configureStore";
import { CATALOG_STATES } from "./CatalogStates";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams): URLSearchParams {
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);
    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    if (productParams.brands.length > 0) params.append('brands', productParams.brands.toString());
    if (productParams.types.length > 0) params.append('types', productParams.types.toString());

    return params;
}

export const fetchAllProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        try {
            const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
            const response = await agent.Catalog.list(params);

            thunkAPI.dispatch(setMetaData(response.metaData));

            return response.items;
            
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data});
        }
    }
);

export const fetchSingleProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchSingleProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
           return agent.Catalog.fetchFilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: [],
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: CATALOG_STATES.IDLE,
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null,
    }),
    reducers: {
        // ProductParams reducers
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 }
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload }
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        },

        // MetaData reducers
        setMetaData: (state, action) => {
            state.metaData = action.payload;            
        }
    },
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

        // Fetch Filters
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = CATALOG_STATES.PendingFetchFilters;
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = CATALOG_STATES.IDLE;
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = CATALOG_STATES.IDLE;
            console.log(action);
        });

    })
});

export const productsSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const { setProductParams, resetProductParams, setMetaData, setPageNumber } = catalogSlice.actions;