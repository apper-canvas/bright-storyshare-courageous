import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '@/layouts/Root'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user } = useSelector((state) => state.user)
  const { isInitialized } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle authentication redirect - moved from handleSubmit
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded')
      }

      const { ApperUI } = window.ApperSDK
      
      // Use ApperUI for authentication
      ApperUI.showLogin("#authentication")
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading if not initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  // Show authentication container if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div id="authentication"></div>
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-card p-8 border border-surface">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-primary mb-2">
                  Welcome Back
                </h2>
                <p className="text-secondary font-ui">
                  Sign in to your StoryShare account
                </p>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <p className="text-error text-sm font-ui">{error}</p>
                </div>
              )}

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                disabled={isLoading}
              />

              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center space-y-4">
                <p className="text-sm text-secondary font-ui">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup' + (searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''))}
                    className="text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
                
                <button
                  type="button"
                  onClick={() => navigate('/reset-password')}
                  className="text-sm text-secondary hover:text-primary transition-colors font-ui"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // This shouldn't render since useEffect handles redirect
  return null
}

export default Login