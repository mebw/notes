import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = { showSearch: false };

export const searchSlice = createSlice({
    name: 'search', //this name is important, because you will need it when you want to access the state. Like:  const noteState = useSelector(state => state.notes); here the .notes is exactly the name specified in the name property of the slice.
    initialState: { value: initialStateValue },
    reducers: {
        showSearch: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { showSearch } = searchSlice.actions;

export default searchSlice.reducer;

