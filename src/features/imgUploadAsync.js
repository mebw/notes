
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { accountService } from '../services/account.service';
import { imageService } from '../services/images.service';
const initialState = { loading: false, uploadedImage: null, error: '' };

// Generates pending, fulfilled and rejected action types
export const uploadImages = createAsyncThunk('images/uploadImage', async ({ imageData }) => {
    const user = accountService.userValue;
    const response = await imageService.uploadImage({ imageData, userId: user?.id });
    return response.imageUrl;
})

const imageUploadSlice = createSlice({
    name: 'imageUpload',
    initialState,
    extraReducers: builder => {
        builder.addCase(uploadImages.pending, state => {
            state.loading = true
        })
        builder.addCase(uploadImages.fulfilled, (state, action) => {
            state.loading = false
            state.uploadedImage = action.payload
            state.error = ''
        })
        builder.addCase(uploadImages.rejected, (state, action) => {
            state.loading = false
            state.uploadedImage = null
            state.error = action.error.message
        })
    }
})

export default imageUploadSlice.reducer

