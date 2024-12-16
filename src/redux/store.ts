import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/components/header/redux/action'
import { useDispatch } from 'react-redux'

export const store = configureStore({
    reducer: {
        user: userReducer
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const userAppDispatch = () => useDispatch<AppDispatch>()