import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user } = useSelector((state) => state.user)
  const { isInitialized } = useAuth()
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Initialize ApperUI login when component mounts and auth is ready
  useEffect(() => {
    if (isInitialized && !user) {
      // Wait a bit for DOM to be ready
      const timer = setTimeout(() => {
        if (window.ApperSDK?.ApperUI) {
          window.ApperSDK.ApperUI.showLogin("#authentication")
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isInitialized, user])

  // Handle authentication redirect
  useEffect(() => {
    if (isInitialized && user) {
      const urlParams = new URLSearchParams(location.search)
      const redirectPath = urlParams.get("redirect")
      
      if (redirectPath) {
        navigate(redirectPath)
      } else {
        navigate('/discover')
      }
    }
  }, [isInitialized, user, location.search, navigate])

  // Show loading if not initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Welcome Back</h1>
          <p className="text-secondary font-ui">Sign in to your StoryShare account</p>
        </div>
        
        <div id="authentication" className="bg-white rounded-xl shadow-card p-8 border border-surface">
          {/* ApperUI will render login form here */}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-secondary font-ui">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login