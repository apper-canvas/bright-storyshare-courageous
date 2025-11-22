import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/layouts/Root'

const Signup = () => {
  const navigate = useNavigate()
  const { isInitialized, user } = useAuth()

  useEffect(() => {
    // Redirect if already authenticated
    if (isInitialized && user) {
      navigate('/')
      return
    }

    // Initialize signup UI when ready
    if (isInitialized && !user) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup('#authentication')
    }
  }, [isInitialized, user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div id="authentication"></div>
        <div className="text-center mt-6">
          <p className="text-secondary font-ui">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-accent hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup