
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { categoryService } from '../../../services/categories.service';
const initialState = { loading: false, systemCategories: null, error: '' };

// Generates pending, fulfilled and rejected action types
export const fetchSystemCategory = createAsyncThunk('categories/systemCategories', async () => {

    const response = await categoryService.getUserNoteCategories({ userId: 1 })
    return response.categories;
})

const systemCategorySlice = createSlice({
    name: 'systemCategory',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchSystemCategory.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchSystemCategory.fulfilled, (state, action) => {
            state.loading = false
            state.systemCategories = action.payload //this value is the response from the server(in this case response.categories)
            state.error = ''
        })
        builder.addCase(fetchSystemCategory.rejected, (state, action) => {
            state.loading = false
            state.systemCategories = null
            state.error = action.error.message
        })
    }
})

export default systemCategorySlice.reducer

