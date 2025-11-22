import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Deep clone the user object to avoid reference issues
      state.user = JSON.parse(JSON.stringify(action.payload))
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload
    }
  }
})

export const { setUser, clearUser, setInitialized } = userSlice.actions

// Selector for easy access to derived state
export const selectUser = (state) => state.user.user
export const selectIsAuthenticated = (state) => state.user.isAuthenticated  
export const selectIsInitialized = (state) => state.user.isInitialized

export default userSlice.reducer