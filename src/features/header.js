import { createSlice } from '@reduxjs/toolkit';
const initialStateValue = { hasLoginInfo: true, showLoginPopup: false, closeDialog: true }; //first time dialog is not open

export const headerSlice = createSlice({
    name: 'header', //this name is important, because you will need it when you want to access the state. Like:  const noteState = useSelector(state => state.notes); here the .notes is exactly the name specified in the name property of the slice.
    initialState: { value: initialStateValue },
    reducers: {
        //containsLoginInfo: this is for if header 1. has no login/register info(for example when it says, email sent for verification), 2. has login info when user logins in, 3. has login info, but user has logged out.
        containsLoginInfo: (state, action) => {
            state.value = { ...state.value, hasLoginInfo: action.payload };
        },
        loginPopup: (state, action) => {
            state.value = { ...state.value, showLoginPopup: action.payload };
        },
        closeDialog: (state, action) => {
            state.value = { ...state.value, closeDialog: action.payload };
        }
    }
});

export const { containsLoginInfo, loginPopup, closeDialog } = headerSlice.actions;

export default headerSlice.reducer;

