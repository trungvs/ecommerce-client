import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../components/counter/counterSlice'
import loadingReducer from '../components/Loading/loadingSlice'
import authReducer from '../components/Auth/authSlice'
import profileReducer from '../components/Profile/profileSlice.js'
import productReducer from '../components/Product/ProductSlice'

const rootReducer = {
    loading: loadingReducer,
    auth: authReducer,
    profile: profileReducer,
    cart: productReducer
}

const store = configureStore({
    reducer: rootReducer
})

export default store