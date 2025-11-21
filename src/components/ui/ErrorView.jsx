import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ErrorView = ({ message = "Something went wrong", onRetry, fullPage = false }) => {
  const content = (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-error to-error/80 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" size={32} className="text-white" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-display text-primary">Oops! Something went wrong</h3>
        <p className="text-secondary font-ui text-lg max-w-md mx-auto">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry} variant="primary" className="inline-flex items-center gap-2">
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = "/"} 
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Home" size={16} />
            Go Home
          </Button>
        </div>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4">
        {content}
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      {content}
    </div>
  )
}

export default ErrorView