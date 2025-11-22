import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/layouts/Root";

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isInitialized } = useAuth()
  const { user } = useSelector((state) => state.user)

const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isInitialized && user) {
      const redirectPath = searchParams.get('redirect') || '/'
      navigate(redirectPath)
      return
    }
  }, [isInitialized, user, navigate, searchParams])

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
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        return
      }

      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address')
        return
      }

      // Here you would integrate with your authentication system
      // For now, we'll simulate the login process
      console.log('Login attempt:', { email: formData.email })
      
      // TODO: Replace with actual authentication logic
      // const { ApperUI } = window.ApperSDK || {}
      // if (ApperUI) {
      //   await ApperUI.login(formData.email, formData.password)
      // }
      
      setError('Authentication integration needed - please implement login logic')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name="BookOpen" size={32} className="text-accent" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-primary">
            Welcome Back
          </h1>
          
          <p className="text-secondary font-ui">
            Sign in to continue your reading journey
          </p>
        </div>

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
                    onClick={() => navigate('/signup')}
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

        <div className="text-center">
          <p className="text-sm text-secondary font-ui">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup' + (searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''))}
              className="text-accent hover:text-accent/80 font-medium"
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