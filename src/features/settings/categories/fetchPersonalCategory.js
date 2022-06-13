
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { accountService } from '../../../services/account.service';
import { categoryService } from '../../../services/categories.service';
const initialState = { loading: false, personalCategories: null, error: '' };

// Generates pending, fulfilled and rejected action types
export const fetchPersonalCategory = createAsyncThunk('categories/personalCategories', async () => {

    const response = await categoryService.getPersonalUserCategories({ userId: accountService.userValue.id })
    return response.categories;
})

const personalCategorySlice = createSlice({
    name: 'personalCategory',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchPersonalCategory.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchPersonalCategory.fulfilled, (state, action) => {
            state.loading = false
            state.personalCategories = action.payload //this value is the response from the server(in this case response.categories)
            state.error = ''
        })
        builder.addCase(fetchPersonalCategory.rejected, (state, action) => {
            state.loading = false
            state.personalCategories = null
            state.error = action.error.message
        })
    }
})

export default personalCategorySlice.reducer

