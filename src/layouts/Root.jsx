import React, { useEffect, useState, createContext, useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, clearUser, setInitialized } from '@/store/userSlice'
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils'

// Create AuthContext for logout functionality
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContext provider')
  }
  return context
}

const Root = () => {
  const [authInitialized, setAuthInitialized] = useState(false)
  const { user, isInitialized } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded')
        }

        const { ApperUI } = window.ApperSDK

        ApperUI.init({
          onSuccess: (user) => {
            dispatch(setUser(user))
            dispatch(setInitialized(true))
            handleNavigation()
          },
          onError: (error) => {
            console.error('Authentication error:', error)
            dispatch(clearUser())
            dispatch(setInitialized(true))
          }
        })

        setAuthInitialized(true)
      } catch (error) {
        console.error('Failed to initialize ApperUI:', error)
        dispatch(setInitialized(true))
        setAuthInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  // Route guard effect
  useEffect(() => {
    if (!isInitialized) return // Don't run route guards until auth is initialized

    const config = getRouteConfig(location.pathname)
    if (config?.allow) {
      const accessCheck = verifyRouteAccess(config.allow, user)
      
      if (!accessCheck.allowed && config.allow.redirectOnDeny) {
        const redirectUrl = accessCheck.excludeRedirectQuery 
          ? config.allow.redirectOnDeny 
          : `${config.allow.redirectOnDeny}?redirect=${encodeURIComponent(location.pathname + location.search)}`
        
        navigate(redirectUrl, { replace: true })
      }
    } else {
      // No config found - require authentication by default
      navigate('/login')
    }
  }, [isInitialized, user, location.pathname, location.search, navigate])

  // Handle post-authentication navigation
  const handleNavigation = () => {
    const urlParams = new URLSearchParams(location.search)
    const redirectPath = urlParams.get('redirect')
    
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

  // Show loading until auth is initialized
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