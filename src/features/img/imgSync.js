import { createSlice } from '@reduxjs/toolkit';
const initialState = { newImageUploaded: false, uploadedImagePath: null, fetchedImagePath: null }; //first time dialog is not open

export const imgSyncSlice = createSlice({
    name: 'imgSync', //this name is important, because you will need it when you want to access the state. Like:  const noteState = useSelector(state => state.notes); here the .notes is exactly the name specified in the name property of the slice.
    initialState,
    reducers: {
        //containsLoginInfo: this is for if header 1. has no login/register info(for example when it says, email sent for verification), 2. has login info when user logins in, 3. has login info, but user has logged out.
        imageUploaded: (state) => {
            state.newImageUploaded = true;
        },
        userSignedIn: (state) => {
            state.newImageUploaded = false;
        },
        uploadedImage: (state, action) => {
            state.newImageUploaded = action.payload;
        },
        fetchedImage: (state, action) => {
            state.newImageUploaded = action.payload;
        }
    }
});

export const { imageUploaded, userSignedIn, uploadedImage, fetchedImage } = imgSyncSlice.actions;

export default imgSyncSlice.reducer;

