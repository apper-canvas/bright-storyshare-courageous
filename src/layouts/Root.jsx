import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils";
import Loading from "@/components/ui/Loading";
import { clearUser, setUser } from "@/store/userSlice";

// Create Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState(null);
  const [apperUI, setApperUI] = useState(null);
  const [sdkError, setSdkError] = useState(null);
  const dispatch = useDispatch();

  // Initialize ApperUI SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        setIsLoading(true);
        setSdkError(null);

        // Poll for SDK availability with timeout
        const maxAttempts = 50; // 5 seconds with 100ms intervals
        let attempts = 0;

        const checkSDK = () => {
          return new Promise((resolve, reject) => {
            const checkAvailability = () => {
              if (!window.ApperSDK) {
                attempts++;
                if (attempts >= maxAttempts) {
                  reject(new Error('ApperSDK not loaded after timeout'));
                  return;
                }
                setTimeout(checkAvailability, 100);
                return;
              }

              const { ApperUI } = window.ApperSDK;
              
              if (!ApperUI || typeof ApperUI.init !== 'function') {
                attempts++;
                if (attempts >= maxAttempts) {
                  reject(new Error('ApperUI not available or init method missing'));
                  return;
                }
                setTimeout(checkAvailability, 100);
                return;
              }

              resolve(ApperUI);
            };

            checkAvailability();
          });
        };

        const apperUIInstance = await checkSDK();
        
        // Initialize ApperUI
        await apperUIInstance.init({
          projectId: import.meta.env.VITE_APPER_PROJECT_ID,
          publicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
          onAuthStateChange: (authUser) => {
            if (authUser) {
              setIsAuthenticated(true);
              setUserState(authUser);
              dispatch(setUser(authUser));
            } else {
              setIsAuthenticated(false);
              setUserState(null);
              dispatch(clearUser());
            }
          }
        });

        setApperUI(apperUIInstance);
        
        // Check initial auth state
        const currentUser = await apperUIInstance.getCurrentUser();
        if (currentUser) {
          setIsAuthenticated(true);
          setUserState(currentUser);
          dispatch(setUser(currentUser));
        }

      } catch (error) {
        console.error('Failed to initialize ApperUI:', error);
        setSdkError(error.message);
        toast.error(`Authentication system failed to initialize: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSDK();
  }, [dispatch]);

  // Authentication methods
  const login = async (email, password) => {
    if (!apperUI) {
      throw new Error('Authentication system not initialized');
    }
    
    try {
      const result = await apperUI.signIn(email, password);
      if (result.user) {
        setIsAuthenticated(true);
        setUserState(result.user);
        dispatch(setUser(result.user));
        toast.success('Successfully signed in!');
      }
      return result;
    } catch (error) {
      toast.error(error.message || 'Sign in failed');
      throw error;
    }
  };

  const signup = async (email, password, metadata = {}) => {
    if (!apperUI) {
      throw new Error('Authentication system not initialized');
    }
    
    try {
      const result = await apperUI.signUp(email, password, metadata);
      if (result.user) {
        toast.success('Account created successfully!');
      }
      return result;
    } catch (error) {
      toast.error(error.message || 'Sign up failed');
      throw error;
    }
  };

  const logout = async () => {
    if (!apperUI) {
      throw new Error('Authentication system not initialized');
    }
    
    try {
      await apperUI.signOut();
      setIsAuthenticated(false);
      setUserState(null);
      dispatch(clearUser());
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error('Sign out failed');
      throw error;
    }
  };

  const resetPassword = async (email) => {
    if (!apperUI) {
      throw new Error('Authentication system not initialized');
    }
    
    try {
      await apperUI.resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Password reset failed');
      throw error;
    }
  };

  const authContextValue = {
    isLoading,
    isAuthenticated,
    user,
    login,
    signup,
    logout,
    resetPassword,
    apperUI,
    sdkError
  };

  // Show loading screen while SDK initializes
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-primary font-medium">Initializing authentication system...</p>
        </div>
      </div>
    );
  }

  // Show error screen if SDK failed to load
  if (sdkError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-error text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-primary mb-2">Authentication System Error</h2>
          <p className="text-gray-600 mb-4">{sdkError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-accent text-primary px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
