import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils";
import { clearUser, setInitialized, setUser } from "@/store/userSlice";

// Auth Context for sharing authentication state and methods
const AuthContext = createContext(null)

function Root() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isInitialized } = useSelector((state) => state.user)
  
  // Local state for controlling loading spinner visibility
  const [authInitialized, setAuthInitialized] = useState(false)

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Wait for ApperSDK to load
        let attempts = 0
        while (!window.ApperSDK && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }

        if (!window.ApperSDK) {
          console.error('ApperSDK failed to load after 5 seconds')
          setAuthInitialized(true)
          return
        }

        const { ApperUI } = window.ApperSDK

        // Set up authentication handlers
        ApperUI.onSuccess = (user) => {
          console.log('Auth success:', user)
          dispatch(setUser(user))
          dispatch(setInitialized(true))
          handleNavigation(user)
          setAuthInitialized(true)
        }

        ApperUI.onError = (error) => {
          console.error('Auth error:', error)
          dispatch(clearUser())
          dispatch(setInitialized(true))
          setAuthInitialized(true)
        }

        // Initialize authentication
        await ApperUI.init()
        
        // If no user after init, still set initialized
        if (!user) {
          setAuthInitialized(true)
          dispatch(setInitialized(true))
        }

      } catch (error) {
        console.error('Authentication initialization failed:', error)
        dispatch(setInitialized(true))
        setAuthInitialized(true)
      }
    }

    initializeAuth()
  }, []) // Empty deps - initialize only once

  // Handle post-authentication navigation
  const handleNavigation = (user) => {
    const urlParams = new URLSearchParams(location.search)
    const redirectPath = urlParams.get("redirect")
    
    if (redirectPath) {
      navigate(redirectPath)
    } else {
      const authPages = ["/login", "/signup", "/callback"]
      const isOnAuthPage = authPages.some(page => location.pathname.includes(page))
      
      if (isOnAuthPage) {
        navigate("/")
      }
    }
  }

  // Route guard effect - runs on every navigation when initialized
  useEffect(() => {
    if (!isInitialized) return // Gate 2: Don't run guards until auth is initialized

    const currentPath = location.pathname
    const config = getRouteConfig(currentPath)
    
    if (config?.allow) {
      const accessCheck = verifyRouteAccess(config, user)
      
      if (!accessCheck.allowed && config.redirectOnDeny) {
        const redirectQuery = accessCheck.excludeRedirectQuery ? '' : `?redirect=${encodeURIComponent(currentPath + location.search)}`
        navigate(`${config.redirectOnDeny}${redirectQuery}`)
      }
    }
  }, [isInitialized, user, location.pathname, location.search, navigate])

  // Logout function
  const logout = async () => {
    try {
      if (window.ApperSDK?.ApperUI) {
        await window.ApperSDK.ApperUI.logout()
      }
      dispatch(clearUser())
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      dispatch(clearUser())
      navigate('/login')
    }
  }

  // Gate 1: Show loading spinner until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  // Provide auth context and render routes
  return (
    <AuthContext.Provider value={{ logout, isInitialized }}>
      <Outlet />
    </AuthContext.Provider>
  )
}

// Hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContext')
  }
  return context
}
export default Root