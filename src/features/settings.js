import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = { showSettings: false };

export const settingsSlice = createSlice({
    name: 'settings', //this name is important, because you will need it when you want to access the state. Like:  const noteState = useSelector(state => state.notes); here the .notes is exactly the name specified in the name property of the slice.
    initialState: { value: initialStateValue },
    reducers: {
        showSettings: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { showSettings } = settingsSlice.actions;

export default settingsSlice.reducer;

