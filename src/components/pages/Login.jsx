import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/layouts/Root'

const Login = () => {
  const navigate = useNavigate()
  const { isInitialized, user } = useAuth()

  useEffect(() => {
    // Redirect if already authenticated
    if (isInitialized && user) {
      navigate('/')
      return
    }

    // Initialize login UI when ready
    if (isInitialized && !user) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showLogin('#authentication')
    }
  }, [isInitialized, user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div id="authentication"></div>
        <div className="text-center mt-6">
          <p className="text-secondary font-ui">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-accent hover:underline"
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