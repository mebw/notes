import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = { user: null, profilePic: null };

export const userSlice = createSlice({
    name: 'user',
    initialState: { value: initialStateValue },
    reducers: {
        loginAction: (state, action) => {
            state.value = action.payload;
        },
        logoutAction: (state) => {
            state.value = initialStateValue;
        },
        updateImagePath: (state, action) => {
            state.value.profilePic = action.payload;
        }
    }
});

export const { loginAction, logoutAction, updateImagePath } = userSlice.actions;

export default userSlice.reducer;

