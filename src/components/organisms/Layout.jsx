import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "@/components/organisms/Header";
import { useAuth } from "@/layouts/Root";

const Layout = () => {
  const { user } = useSelector((state) => state.user)
  const { logout } = useAuth()
  
  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout