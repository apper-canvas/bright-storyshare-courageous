import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
<div className="min-h-screen bg-background theme-transition">
      <Header />
      <main>
        <Outlet />
      </main>
      
<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Layout;