import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '@/layouts/Root'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isInitialized } = useAuth()

  useEffect(() => {
    if (isInitialized && user) {
      // User is already logged in, redirect
      const redirectPath = searchParams.get('redirect') || '/'
      navigate(redirectPath, { replace: true })
      return
    }

    if (isInitialized && !user) {
      // Show login form
      const { ApperUI } = window.ApperSDK
      ApperUI.showLogin("#authentication")
    }
  }, [isInitialized, user, navigate, searchParams])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-primary">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-secondary font-ui">
            Sign in to your account to continue
          </p>
        </div>
        
        <div id="authentication" className="mt-8"></div>
        
        <div className="text-center">
          <p className="text-sm text-secondary font-ui">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-accent hover:text-accent/80 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login