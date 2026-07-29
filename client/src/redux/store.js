import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer, persistStore} from 'redux-persist'
import storageImport from 'redux-persist/lib/storage'

const storage = storageImport.default ? storageImport.default : storageImport;

//this handle to remember or store user data in teh browser
const rootReducer = combineReducers({user: userReducer}) //will pass this userReducer to persitConfig
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer) //combining the two storage to work data local and in browser

//ensure to install npm install @reduxjs/toolkit react-redux in the client side
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    })
})

export const persistor = persistStore(store);