import { createSlice } from '@reduxjs/toolkit';
import { NoteMode } from '../helper/NoteMode';
const initialStateValue = { noteMode: NoteMode.View };

export const noteSlice = createSlice({
    name: 'notes', //this name is important, because you will need it when you want to access the state. Like:  const noteState = useSelector(state => state.notes); here the .notes is exactly the name specified in the name property of the slice.
    initialState: { value: initialStateValue },
    reducers: {
        noteMode: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { noteMode } = noteSlice.actions;

export default noteSlice.reducer;

