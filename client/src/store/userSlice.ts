import { createSlice } from "@reduxjs/toolkit";
import { User } from "../API/types";

export interface UserSlice {
    userLoaded: boolean;
    user: User | null;
}

const initialState: UserSlice = {
    userLoaded: false,
    user: null
}

// using the CreateSlice() function from Redux Toolkit
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.userLoaded = action.payload.userLoaded;
        }
    }
});

export const { setUser } = userSlice.actions;