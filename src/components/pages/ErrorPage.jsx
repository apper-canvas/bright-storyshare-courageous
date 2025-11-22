import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const error = searchParams.get('message') || 'An authentication error occurred'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <div>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">
            Authentication Error
          </h2>
          <p className="text-secondary font-ui">
            {error}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Back to Login
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage