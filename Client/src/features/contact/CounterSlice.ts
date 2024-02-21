import { createSlice } from "@reduxjs/toolkit";

export interface CounterSate {
    title: string;
    count: number;
}

const initialState: CounterSate = {
    title: "YARC (Yet another redux counter with Redux toolkit)",
    count: 42,
}

export const counterSlice = createSlice( {
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.count += action.payload
        },
        decrement: (state, action) => {
            state.count -= action.payload
        },
    }
});

export const { increment, decrement } = counterSlice.actions;