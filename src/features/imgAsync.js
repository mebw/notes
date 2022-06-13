
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { accountService } from '../services/account.service';
import { imageService } from '../services/images.service';
const initialState = { loading: false, profilePic: null, error: '' };

// Generates pending, fulfilled and rejected action types
export const fetchImagePath = createAsyncThunk('images/fetchImages', async () => {
    const user = accountService.userValue;
    const response = await imageService.getImage({ userId: user?.id });
    return response.imagePath;
})

const imagePathSlice = createSlice({
    name: 'imagePath',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchImagePath.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchImagePath.fulfilled, (state, action) => {
            state.loading = false
            state.profilePic = action.payload
            state.error = ''
        })
        builder.addCase(fetchImagePath.rejected, (state, action) => {
            state.loading = false
            state.profilePic = null
            state.error = action.error.message
        })
    }
})

export default imagePathSlice.reducer

