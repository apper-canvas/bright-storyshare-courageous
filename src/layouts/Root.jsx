import React, { useEffect, useState, createContext, useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, setInitialized } from '@/store/userSlice'
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils'

// Create AuthContext
const AuthContext = createContext(null)

// Custom hook to use auth context
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
  
  // Local state for auth initialization
  const [authInitialized, setAuthInitialized] = useState(false)

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded')
        }

        const { ApperUI } = window.ApperSDK

        // Set up authentication handlers
        ApperUI.onSuccess = (user) => {
          dispatch(setUser(user))
          dispatch(setInitialized(true))
          handleNavigation()
        }

        ApperUI.onError = (error) => {
          console.error('Authentication error:', error)
          dispatch(clearUser())
          dispatch(setInitialized(true))
        }

        // Initialize ApperUI
        await ApperUI.initialize()
        
      } catch (error) {
        console.error('Failed to initialize authentication:', error)
        dispatch(setInitialized(true))
      } finally {
        setAuthInitialized(true)
      }
    }

    initializeAuth()
  }, [dispatch])

  // Route guard - runs on every navigation
  useEffect(() => {
    if (!isInitialized) return // Don't run route guards until auth is initialized

    const config = getRouteConfig(location.pathname)
    const accessCheck = verifyRouteAccess(config, user)

    if (!accessCheck.allowed) {
      const currentPath = location.pathname + location.search
      const redirectUrl = accessCheck.excludeRedirectQuery 
        ? accessCheck.redirectTo 
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(currentPath)}`
      
      navigate(redirectUrl, { replace: true })
    }
  }, [isInitialized, user, location.pathname, location.search, navigate])

  // Handle post-authentication navigation
  const handleNavigation = () => {
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
      // Otherwise stay on current page
    }
  }

  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK
      await ApperUI.signOut()
      dispatch(clearUser())
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ logout, isInitialized, user }}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default Root