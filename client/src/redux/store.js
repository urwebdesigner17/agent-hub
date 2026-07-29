import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

//ensure to install npm install @reduxjs/toolkit react-redux in the client side
export const store = configureStore({
  reducer: {user: userReducer},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    })
})