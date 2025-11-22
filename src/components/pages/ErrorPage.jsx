import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get('message') || 'An authentication error occurred'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={32} className="text-error" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold text-primary">
            Authentication Error
          </h1>
          
          <p className="text-error font-ui">
            {errorMessage}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            className="w-full"
          >
            Try Again
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
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