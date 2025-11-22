import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/layouts/Root'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Login = () => {
  const navigate = useNavigate()
  const { isInitialized, user } = useAuth()

  useEffect(() => {
    if (isInitialized && user) {
      // User is already logged in, redirect
      navigate('/')
      return
    }

    if (isInitialized && !user) {
      // Show login form
      const { ApperUI } = window.ApperSDK
      ApperUI.showLogin("#authentication")
    }
  }, [isInitialized, user, navigate])

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name="BookOpen" size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary">
            Welcome Back
          </h1>
          <p className="text-secondary font-ui">
            Sign in to continue your reading journey
          </p>
        </div>

        {/* Authentication Container */}
        <div id="authentication" className="space-y-6">
          {/* ApperUI will render login form here */}
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-secondary font-ui">
            Don't have an account?{' '}
            <Button
              variant="ghost"
              onClick={() => navigate('/signup')}
              className="text-accent hover:text-accent/80 p-0 h-auto"
            >
              Sign up here
            </Button>
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs text-secondary">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-secondary hover:text-primary p-0 h-auto"
            >
              <ApperIcon name="ArrowLeft" size={14} className="mr-1" />
              Back to Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login