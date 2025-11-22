import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import { useAuth } from '@/layouts/Root'

const Signup = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isInitialized } = useAuth()
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    if (isInitialized && user) {
      const redirectPath = searchParams.get('redirect') || '/'
      navigate(redirectPath)
      return
    }

    if (isInitialized && !user) {
      const { ApperUI } = window.ApperSDK || {}
      if (ApperUI) {
        ApperUI.showSignup("#authentication")
      }
    }
  }, [isInitialized, user, navigate, searchParams])

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
            Join StoryShare
          </h1>
          
          <p className="text-secondary font-ui">
            Create an account to start writing and sharing your stories
          </p>
        </div>

        <div id="authentication" className="space-y-6">
          {/* ApperUI will render the signup form here */}
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary font-ui">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login' + (searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''))}
              className="text-accent hover:text-accent/80 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup