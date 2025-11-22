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
      // Deep clone to ensure immutability
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
export default userSlice.reducer