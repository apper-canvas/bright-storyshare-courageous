import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, setInitialized } from '@/store/userSlice'
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils'
import Loading from '@/components/ui/Loading'

// Create AuthContext
const AuthContext = createContext({})

// useAuth hook - exported for use throughout app
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
  
  // Redux state
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.user)
  
  // Local loading state for initial auth check
  const [authInitialized, setAuthInitialized] = useState(false)

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Wait for ApperSDK to load
        let attempts = 0
        const maxAttempts = 50
        
        while (!window.ApperSDK && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }

        if (!window.ApperSDK) {
          throw new Error('ApperSDK failed to load')
        }
const { ApperClient, ApperUI } = window.ApperSDK

        // Initialize ApperClient
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        })
try {
          // Check if user is already authenticated
          const userData = await ApperUI.getUser()
          if (userData) {
            dispatch(setUser(userData))
            handleNavigation(userData)
          } else {
            dispatch(clearUser())
          }
        } catch (error) {
          console.error('Authentication error:', error)
          dispatch(clearUser())
          
          // Navigate to error page with error details
          if (error?.message) {
            navigate(`/error?message=${encodeURIComponent(error.message)}`)
          }
        } finally {
          dispatch(setInitialized(true))
        }

      } catch (error) {
        console.error('Failed to initialize authentication:', error)
        dispatch(setInitialized(true))
      } finally {
        setAuthInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  // Handle post-authentication navigation
  const handleNavigation = (userData) => {
    const urlParams = new URLSearchParams(location.search)
    const redirectPath = urlParams.get('redirect')
    const authPages = ['/login', '/signup', '/callback']
    
    if (redirectPath) {
      navigate(redirectPath)
    } else if (authPages.some(page => location.pathname.includes(page))) {
      navigate('/')
    }
    // Otherwise stay on current page
  }

  // Route guard effect
  useEffect(() => {
    // Only run route guards after auth is initialized
    if (!isInitialized) return

    const config = getRouteConfig(location.pathname)
    
    if (config?.allow) {
      const accessCheck = verifyRouteAccess(config, user)
      
      if (!accessCheck.allowed) {
        const redirectTo = config.allow.redirectOnDeny || '/login'
        const excludeQuery = config.allow.excludeRedirectQuery || false
        
        if (!excludeQuery && !location.pathname.startsWith('/login')) {
          const currentPath = location.pathname + location.search
          navigate(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
        } else {
          navigate(redirectTo)
        }
      }
    }
  }, [isInitialized, user, location.pathname, location.search, navigate])

  // Logout function
const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK
      await ApperUI.signOut()
      dispatch(clearUser())
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force local logout even if remote logout fails
      dispatch(clearUser())
      navigate('/login')
    }
  }

  // Show loading until auth is initialized
  if (!authInitialized) {
    return <Loading type="page" />
  }

  // Auth context value
  const authContextValue = {
    user,
    isAuthenticated,
    isInitialized,
    logout
  }

  // App-level state for outlet context
  const outletContext = {
    user,
    isAuthenticated,
    isInitialized,
    logout
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Outlet context={outletContext} />
    </AuthContext.Provider>
  )
}

export default Root