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
      // Deep clone the user object to prevent mutations
      state.user = JSON.parse(JSON.stringify(action.payload))
      state.isAuthenticated = !!action.payload
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
export default userSlice.reducer