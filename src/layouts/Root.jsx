import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { setUser, clearUser, setInitialized } from '@/store/userSlice'
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils'

// Create AuthContext
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider')
  }
  return context
}

const Root = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isInitialized } = useSelector((state) => state.user)
  
  const [authInitialized, setAuthInitialized] = useState(false)

  // Initialize authentication once
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const { ApperUI } = window.ApperSDK || {}
        
        if (!ApperUI) {
          console.warn('ApperSDK not loaded')
          setAuthInitialized(true)
          dispatch(setInitialized(true))
          return
        }

        // Setup ApperUI with callbacks
        ApperUI.onSuccess = (user) => {
          console.log('Auth success:', user)
          dispatch(setUser(user))
          dispatch(setInitialized(true))
          handleNavigation(user)
        }

        ApperUI.onError = (error) => {
          console.error('Auth error:', error)
          dispatch(clearUser())
          dispatch(setInitialized(true))
        }

        // Check if user is already authenticated
        const currentUser = ApperUI.getCurrentUser?.() || null
        if (currentUser) {
          dispatch(setUser(currentUser))
        } else {
          dispatch(clearUser())
        }
        
        dispatch(setInitialized(true))
        setAuthInitialized(true)
      } catch (error) {
        console.error('Auth initialization error:', error)
        dispatch(clearUser())
        dispatch(setInitialized(true))
        setAuthInitialized(true)
      }
    }

    initializeAuth()
  }, [dispatch])

  // Route guard effect
  useEffect(() => {
    if (!isInitialized) return

    const config = getRouteConfig(location.pathname)
    const accessCheck = verifyRouteAccess(config, user)

    if (!accessCheck.allowed && accessCheck.redirectTo) {
      const redirectUrl = accessCheck.excludeRedirectQuery 
        ? accessCheck.redirectTo
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`
      
      navigate(redirectUrl)
    }
  }, [isInitialized, user, location.pathname, location.search, navigate])

  // Handle post-authentication navigation
  const handleNavigation = (authenticatedUser) => {
    const urlParams = new URLSearchParams(location.search)
    const redirectPath = urlParams.get("redirect")
    
    if (redirectPath) {
      navigate(redirectPath)
} else if (["/login", "/signup", "/callback"].includes(location.pathname)) {
      navigate("/discover")
    }
    // Otherwise stay on current page
  }

  // Logout function
  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK || {}
      if (ApperUI?.logout) {
        await ApperUI.logout()
      }
      dispatch(clearUser())
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      dispatch(clearUser())
      navigate('/login')
    }
  }

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ logout, isInitialized }}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default Root