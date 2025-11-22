import React from "react"
import { Outlet, useOutletContext } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "@/components/organisms/Header"
import { useAuth } from '@/layouts/Root'

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const parentContext = useOutletContext()
  
  // Combine auth context with any additional layout state
  const layoutContext = {
    ...parentContext,
    user,
    isAuthenticated,
    logout,
    // Add any layout-specific state here
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet context={layoutContext} />
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