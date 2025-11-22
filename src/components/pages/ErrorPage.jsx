import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get('message') || 'An unexpected error occurred'

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <ApperIcon name="AlertCircle" size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Error</h1>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => window.location.href = '/login'}
            >
              Try Again
            </Button>
            
            <Link to="/" className="block">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage