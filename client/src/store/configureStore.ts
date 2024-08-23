import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { userSlice } from "./userSlice";
import { chapterSlice } from "./chapterSlice";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        user: userSlice.reducer,
        chapter: chapterSlice.reducer
    }
});

// these are optional -- just custom types and hooks to make our lives easier
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;