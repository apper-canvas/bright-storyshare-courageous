import React, { useEffect, useState, createContext, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, Outlet } from "react-router-dom"
import { setUser, clearUser, setInitialized } from "@/store/userSlice"
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils"

// Auth Context
const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent/30 rounded-full animate-spin" style={{animationDirection: "reverse", animationDuration: "1.5s"}}></div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-display text-primary">Loading StoryShare</h3>
        <p className="text-secondary font-ui">Initializing authentication...</p>
      </div>
    </div>
  </div>
)

const Root = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isInitialized } = useSelector(state => state.user)
  const [authInitialized, setAuthInitialized] = useState(false)

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!window.ApperSDK) {
          console.error("ApperSDK not loaded")
          setAuthInitialized(true)
          dispatch(setInitialized(true))
          return
        }

        const { ApperUI } = window.ApperSDK

        // Set up auth handlers
        const onSuccess = (userData) => {
          dispatch(setUser(userData))
          dispatch(setInitialized(true))
          setAuthInitialized(true)
          handleNavigation(userData)
        }

        const onError = (error) => {
          console.error("Auth error:", error)
          dispatch(clearUser())
          dispatch(setInitialized(true))
          setAuthInitialized(true)
        }

        // Initialize ApperUI
        ApperUI.onSuccess = onSuccess
        ApperUI.onError = onError

        // Check current auth state
        const currentUser = await ApperUI.getCurrentUser?.()
        if (currentUser) {
          dispatch(setUser(currentUser))
        } else {
          dispatch(clearUser())
        }
        
        dispatch(setInitialized(true))
        setAuthInitialized(true)

      } catch (error) {
        console.error("Failed to initialize auth:", error)
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
    if (!config?.allow) return

    const accessCheck = verifyRouteAccess(config, user)
    
    if (!accessCheck.allowed && accessCheck.redirectTo) {
      const urlParams = new URLSearchParams(location.search)
      const redirectUrl = accessCheck.excludeRedirectQuery 
        ? accessCheck.redirectTo 
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`
      
      navigate(redirectUrl)
    }
  }, [isInitialized, user, location.pathname, location.search, navigate])

  const handleNavigation = (userData) => {
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

  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK
      await ApperUI.logout?.()
      dispatch(clearUser())
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      dispatch(clearUser())
      navigate("/login")
    }
  }

  // Show loading until auth is initialized
  if (!authInitialized) {
    return <LoadingSpinner />
  }

  const contextValue = {
    user,
    isAuthenticated: user !== null,
    isInitialized,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default Root