
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { accountService } from '../../../services/account.service';
import { categoryService } from '../../../services/categories.service';
const initialState = { loading: false, categoryNames: null, error: '' };

// Generates pending, fulfilled and rejected action types
export const fetchUserCategoryNames = createAsyncThunk('categories/userCategoryNames', async () => {

    const userId = accountService.userValue.id;
    const res = await categoryService.getCategoryNames({ userId });
    return res.categoryNames;
})

const userCategoryNamesSlice = createSlice({
    name: 'userCategoryNames',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchUserCategoryNames.pending, state => {
            state.loading = true
        })
        builder.addCase(fetchUserCategoryNames.fulfilled, (state, action) => {
            state.loading = false
            state.categoryNames = action.payload //this value is the response from the server(in this case res.categoryNames)
            state.error = ''
        })
        builder.addCase(fetchUserCategoryNames.rejected, (state, action) => {
            state.loading = false
            state.categoryNames = null
            state.error = action.error.message
        })
    }
})

export default userCategoryNamesSlice.reducer

