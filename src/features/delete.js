import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = { noteName: '', noteId: '', deleteNote: false, showDeleteDialog: false };

export const deleteSlice = createSlice({
    name: 'delete',
    initialState: { value: initialStateValue },
    reducers: {
        // yes: (state, action) => {
        //     state.value = action.payload;
        // },
        yes: (state) => {
            state.value = { ...state.value, showDeleteDialog: false, deleteNote: true };
        },
        no: (state) => {
            state.value = initialStateValue;
        },
        showDialog: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { yes, no, showDialog } = deleteSlice.actions;

export default deleteSlice.reducer;

