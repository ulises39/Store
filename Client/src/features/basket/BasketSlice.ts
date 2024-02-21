import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/modules/interfaces/Basket";
import agent from "../../app/api/Agent";
import { BASKET_STATES } from "./BasketStates";

interface BasketState {
    basket: Basket | null
    status: BASKET_STATES | string,
}

const initialState: BasketState = {
    basket: null,
    status: BASKET_STATES.IDLE
}

export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity?: number }>(
    'basket/addBasketItemAsync', 
    async ({ productId, quantity = 1 }, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
);

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number, quantity: number, name?: string }>(
        'basket/removeBasketItemAsync',
        async({ productId, quantity}, thunkAPI) => {
            try {
                await agent.Basket.removeItem(productId, quantity);
            } catch (error: any) {
                return thunkAPI.rejectWithValue({ error: error.data });
            }
        }
);

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        }        
    },
    extraReducers: (builder => {
        // Add Basket Item States
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            console.log(action);
            state.status = `${BASKET_STATES.PendingAddItem}-${action.meta.arg.productId}`;
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = BASKET_STATES.IDLE;
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = BASKET_STATES.IDLE;
        });

        // Remove Basket Item States
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = `${BASKET_STATES.PendingRemoveItem}-${action.meta.arg.productId}${action.meta.arg.name}`;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity } = action.meta.arg;
            const intemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            
            if (intemIndex === -1 || intemIndex === undefined) return;

            state.basket!.items[intemIndex].quantity -= quantity!;

            if (state.basket?.items[intemIndex].quantity === 0) state.basket.items.splice(intemIndex, 1);

            state.status = BASKET_STATES.IDLE;
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = BASKET_STATES.IDLE;
        });
    })
});

export const { setBasket } = basketSlice.actions;