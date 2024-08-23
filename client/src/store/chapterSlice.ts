import { createSlice } from "@reduxjs/toolkit";
import { Chapter } from "../API/types";

export interface ChapterSlice {
    chaptersLoaded: boolean;
    chapters: Chapter[];
}

const initialState: ChapterSlice = {
    chaptersLoaded: false,
    chapters: []
}

// using the CreateSlice() function from Redux Toolkit
export const chapterSlice = createSlice({
    name: "chapter",
    initialState,
    reducers: {
        setChapters: (state, action) => {
            state.chaptersLoaded = action.payload.chaptersLoaded;
            state.chapters = action.payload.chapters;
        }
    }
});

export const { setChapters } = chapterSlice.actions;