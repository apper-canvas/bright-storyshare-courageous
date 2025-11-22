import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setInitialized, setUser } from "@/store/userSlice";
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils";

// Create AuthContext
const AuthContext = createContext({
  logout: () => {},
  isInitialized: false
});

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider');
  }
  return context;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

const Root = () => {
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.user);
  const [authInitialized, setAuthInitialized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Wait for ApperSDK to load
        let attempts = 0;
        while (!window.ApperSDK && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.ApperSDK) {
          throw new Error('ApperSDK failed to load');
        }

        const { ApperUI } = window.ApperSDK;

        // Configure ApperUI callbacks
        ApperUI.configure({
          onSuccess: (userData) => {
            console.log('Authentication successful:', userData);
            dispatch(setUser(userData));
            dispatch(setInitialized(true));
            setAuthInitialized(true);
            handleNavigation();
          },
          onError: (error) => {
            console.error('Authentication error:', error);
            dispatch(clearUser());
            dispatch(setInitialized(true));
            setAuthInitialized(true);
          }
        });

        // Check existing session
        ApperUI.initialize();
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        dispatch(setInitialized(true));
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Route guard effect
  useEffect(() => {
    if (!isInitialized) return;

    const config = getRouteConfig(location.pathname);
    const accessCheck = verifyRouteAccess(config, user);

    if (!accessCheck.allowed && accessCheck.redirectTo) {
      const redirectUrl = accessCheck.excludeRedirectQuery 
        ? accessCheck.redirectTo
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      
      navigate(redirectUrl);
    }
  }, [isInitialized, user, location.pathname, location.search, navigate]);

  // Handle post-authentication navigation
  const handleNavigation = () => {
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get("redirect");
    const authPages = ["/login", "/signup", "/callback"];
    const isOnAuthPage = authPages.some(page => location.pathname.includes(page));

    if (redirectPath) {
      navigate(redirectPath);
    } else if (isOnAuthPage) {
      navigate("/");
    }
    // Otherwise stay on current page
  };

  // Logout function
  const logout = async () => {
    try {
      if (window.ApperSDK?.ApperUI) {
        await window.ApperSDK.ApperUI.signOut();
      }
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(clearUser());
      navigate('/login');
    }
  };

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return <LoadingSpinner />;
  }

  const authContextValue = {
    logout,
    isInitialized
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default Root;