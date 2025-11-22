import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const errorMessage = searchParams.get('message') || 'An authentication error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Error Illustration */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="AlertTriangle" size={48} className="text-error" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-display font-bold text-primary">
            Authentication Error
          </h1>
          <p className="text-secondary font-ui leading-relaxed">
            {errorMessage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/login")}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="LogIn" size={16} />
            Try Again
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Home" size={16} />
            Back to Stories
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage