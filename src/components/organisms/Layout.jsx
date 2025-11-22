import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const { isInitialized } = useAuth()
  
  // Don't render layout until authentication is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout