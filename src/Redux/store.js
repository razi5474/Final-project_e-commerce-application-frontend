import { configureStore } from '@reduxjs/toolkit'
import userReducer from './Features/user/userSlice'
import themeReducer from './Features/shared/themeSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme:themeReducer
  },
})