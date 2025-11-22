import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const outletContext = {
    // Add any app-level state or methods that need to be passed to child routes
    appName: "StoryShare"
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