import React from "react"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "@/components/organisms/Header"

const Layout = () => {
  // App-level state that needs to be shared with all route components
  const outletContextValue = {
    // Add any app-level state and methods here that need to be passed to route elements
    appVersion: "1.0.0",
    // Any other shared state can be added here
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet context={outletContextValue} />
      </main>
      
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
    </div>
  )
}

export default Layout