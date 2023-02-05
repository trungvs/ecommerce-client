import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        auth: false
    },
    reducers: {
        setAuth: (state, action) => {
            localStorage.setItem("access_token", action.payload.token)
        },
        removeAuth: (state) => {
            state = {}
        },
        setLoginSuccess: (state, action) => {
            state.auth = action.payload
        }
    }
})

export const { setAuth, removeAuth, setLoginSuccess } = authSlice.actions

export default authSlice.reducer