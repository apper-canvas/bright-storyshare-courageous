import React, { useState, useEffect, createContext, useContext } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, setInitialized } from '@/store/userSlice'
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils'
import Loading from '@/components/ui/Loading'

// AuthContext for useAuth hook
const AuthContext = createContext({
  logout: () => {},
  isInitialized: false
})

// useAuth hook to be used throughout the application
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider')
  }
  
  const { user, isAuthenticated, isInitialized } = useSelector(state => state.user)
  
  return {
    ...context,
    user,
    isAuthenticated,
    isInitialized
  }
}

const Root = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Local state for authentication initialization
  const [authInitialized, setAuthInitialized] = useState(false)
  
  // Redux state
  const { user, isInitialized } = useSelector(state => state.user)

  // Initialize authentication once
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if ApperSDK is loaded
        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded')
        }

        const { ApperUI } = window.ApperSDK

        // Configure ApperUI with success/error handlers
        const authConfig = {
          onSuccess: (user) => {
            console.log('Authentication successful:', user)
            dispatch(setUser(user))
            dispatch(setInitialized(true))
            handleNavigation(user)
          },
          onError: (error) => {
            console.error('Authentication error:', error)
            dispatch(clearUser())
            dispatch(setInitialized(true))
          }
        }

        // Initialize ApperUI
        ApperUI.initialize(authConfig)

        // Check current authentication status
        const currentUser = ApperUI.getCurrentUser()
        if (currentUser) {
          dispatch(setUser(currentUser))
        } else {
          dispatch(clearUser())
        }
        dispatch(setInitialized(true))

      } catch (error) {
        console.error('Failed to initialize authentication:', error)
        dispatch(clearUser())
        dispatch(setInitialized(true))
      } finally {
        setAuthInitialized(true)
      }
    }

    initializeAuth()
  }, [dispatch])

  // Handle post-authentication navigation
  const handleNavigation = (user) => {
    const urlParams = new URLSearchParams(location.search)
    const redirectPath = urlParams.get('redirect')
    
    if (redirectPath) {
      navigate(redirectPath)
    } else {
      const authPages = ['/login', '/signup', '/callback']
      const isOnAuthPage = authPages.some(page => location.pathname.includes(page))
      
      if (isOnAuthPage) {
        navigate('/')
      }
      // Otherwise stay on current page
    }
  }

  // Route guard effect - only run when fully initialized
  useEffect(() => {
    // Early exit if not initialized
    if (!isInitialized) return

    const checkRouteAccess = () => {
      const config = getRouteConfig(location.pathname)
      
      if (config?.allow) {
        const access = verifyRouteAccess(config, user)
        
        if (!access.allowed) {
          const redirectTo = config.allow.redirectOnDeny || '/login'
          const excludeQuery = config.allow.excludeRedirectQuery || false
          
          if (!excludeQuery) {
            const currentPath = `${location.pathname}${location.search}`
            navigate(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
          } else {
            navigate(redirectTo)
          }
        }
      }
    }

    checkRouteAccess()
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
      console.error('Logout failed:', error)
      // Force logout locally even if SDK call fails
      dispatch(clearUser())
      navigate('/login')
    }
  }

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
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