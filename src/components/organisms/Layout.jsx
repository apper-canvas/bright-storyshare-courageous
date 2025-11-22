import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  // App-level state that can be passed to routes via outlet context
  const [globalState, setGlobalState] = useState({
    searchQuery: '',
    filters: {},
    notifications: []
  })

  const outletContext = {
    globalState,
    setGlobalState,
    // Add other app-level methods and state here
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
