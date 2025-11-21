import React from "react"
import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { router } from "@/router"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  )
}

export default App