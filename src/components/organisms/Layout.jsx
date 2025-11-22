import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  // Create outlet context with app-level state
  const outletContext = {
    user,
    isAuthenticated
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet context={outletContext} />
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
  );
};

export default Layout;