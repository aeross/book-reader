import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: "Redux counter with Redux Toolkit"
}

// using the CreateSlice() function from Redux Toolkit
export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers.
            state.data += action.payload
        },
        decrement: (state, action) => {
            state.data -= action.payload
        }
    }
});

export const { increment, decrement } = counterSlice.actions;