import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        username: "Họ và tên",
        activeField: '/',
        isAdmin: false
    },
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload
        },
        setActiveField: (state, action) => {
            state.activeField = action.payload
        },
        setAdmin: (state, action) => {
            state.isAdmin = action.payload
        }
    }
})

export const { setUsername, setActiveField, setAdmin } = profileSlice.actions

export default profileSlice.reducer