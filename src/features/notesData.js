import { createSlice } from '@reduxjs/toolkit';

export const notesDataSlice = createSlice({
    name: 'notesData',
    initialState: {
        notes: [],
        pending: false,
        error: false,
        updated: false
    },
    reducers: {
        getStart: (state) => {
            state.pending = true;
        },
        getSuccess: (state, action) => {
            state.pending = false;
            state.notes = action.payload;
        },
        getFailure: (state) => {
            state.pending = false;
            state.error = true;
        },
        setUpdated: (state, action) => {
            state.updated = action.payload;
        },
    },
});

export const { getStart, getSuccess, getFailure, setUpdated } = notesDataSlice.actions;

export default notesDataSlice.reducer;

