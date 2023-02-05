import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        open: false
    },
    reducers: {
        openLoading: (state) => {
            state.open = true
        },
        closeLoading: (state) => {
            state.open = false
        }
    }
})

export const { openLoading, closeLoading } = loadingSlice.actions

export const selectLoading = (state) => {
    return state.loading.open
}

export default loadingSlice.reducer