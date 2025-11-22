import React, { useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
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
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#authentication")
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
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join StoryShare</h1>
            <p className="text-gray-600">Create your account and start sharing stories</p>
          </div>
          
          <div id="authentication"></div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup