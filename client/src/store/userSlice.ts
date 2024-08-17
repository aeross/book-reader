import { createSlice } from "@reduxjs/toolkit";
import { User } from "../API/types";

export interface UserSlice {
    user: User | null;
}

const initialState: UserSlice = {
    user: null
}

// using the CreateSlice() function from Redux Toolkit
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
});

export const { setUser } = userSlice.actions;