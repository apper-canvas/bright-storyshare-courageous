import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const message = searchParams.get('message') || 'An authentication error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <ApperIcon name="AlertCircle" size={64} className="text-error mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold text-primary mb-2">
          Authentication Error
        </h1>
        <p className="text-secondary font-ui mb-6">
          {message}
        </p>
        <Button onClick={() => navigate('/login')}>
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Login
        </Button>
      </div>
    </div>
  )
}

export default ErrorPage