import React, { useEffect, useState, createContext, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setInitialized } from '@/store/userSlice';
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils';
import { ToastContainer } from 'react-toastify';

const AuthContext = createContext();

const Root = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitialized } = useSelector((state) => state.user);
  
  const [authInitialized, setAuthInitialized] = useState(false);

  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK;
      await ApperUI.logout();
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      dispatch(clearUser());
      navigate('/login');
    }
  };

  const initializeAuth = async () => {
    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded');
      }

const { ApperUI } = window.ApperSDK;
      
      ApperUI.init({
        onSuccess: (userData) => {
          console.log('Auth success:', userData);
          dispatch(setUser(userData));
          dispatch(setInitialized(true));
          handleNavigation(userData);
        },
        onError: (error) => {
          console.log('Auth error:', error);
          dispatch(clearUser());
          dispatch(setInitialized(true));
        }
      });
    } catch (error) {
      console.error('Auth initialization failed:', error);
      dispatch(clearUser());
      dispatch(setInitialized(true));
    } finally {
      setAuthInitialized(true);
    }
  };

  const handleNavigation = (userData) => {
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get('redirect');
    
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      const authPages = ["/login", "/signup", "/callback"];
      const isOnAuthPage = authPages.some(page => location.pathname.includes(page));
      
      if (isOnAuthPage) {
        navigate('/');
      }
    }
  };

  // Initialize auth once
  useEffect(() => {
    initializeAuth();
  }, []);

  // Route guard effect
  useEffect(() => {
    if (!isInitialized) return;

    const config = getRouteConfig(location.pathname);
    const accessCheck = verifyRouteAccess(config, user);

    if (!accessCheck.allowed && accessCheck.redirectTo) {
      const currentPath = `${location.pathname}${location.search}`;
      const redirectUrl = accessCheck.excludeRedirectQuery
        ? accessCheck.redirectTo
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      
      navigate(redirectUrl);
    }
  }, [isInitialized, user, location.pathname, location.search, navigate]);

  // Show loading until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ logout, isInitialized }}>
      <Outlet />
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContext provider');
  }
  return context;
};

export default Root;