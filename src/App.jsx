import React from "react"
import { RouterProvider } from "react-router-dom"
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ToastContainer } from "react-toastify"
import { router } from "@/router"
import userReducer from '@/store/userSlice'

// Configure Redux store
const store = configureStore({
  reducer: {
    user: userReducer
  }
})

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="toast-container"
        style={{ zIndex: 9999 }}
      />
    </Provider>
  )
}

export default App