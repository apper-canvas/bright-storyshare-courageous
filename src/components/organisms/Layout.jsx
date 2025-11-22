import React from "react"
import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import Header from "@/components/organisms/Header"
import { useAuth } from "@/layouts/Root"

const Layout = () => {
  const user = useSelector((state) => state.user.user)
  const { logout, isInitialized } = useAuth()
  
  // Prepare outlet context with app-level state and methods
  const outletContext = {
    user,
    isInitialized,
    logout
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet context={outletContext} />
      </main>
    </div>
  )
}

export default Layout