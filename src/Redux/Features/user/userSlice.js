import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData:{},
  isAuthUser: false
}

export const usererSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state,action) => {
      state.userData = action.payload
      state.isAuthUser = true  
    },
    clearUser: (state) => {
       state.isAuthUser = false
       state.userData = {}
    }
},
})

// Action creators are generated for each case reducer function
export const { saveUser,clearUser } = usererSlice.actions

export default usererSlice.reducer