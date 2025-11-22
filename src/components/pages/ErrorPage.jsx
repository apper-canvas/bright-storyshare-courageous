import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ApperIcon } from "@/components";
import Button from "@/components/atoms/Button";

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get('message') || 'We encountered an unexpected error.'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <ApperIcon name="AlertTriangle" size={64} className="mx-auto text-error" />
          <h1 className="text-3xl font-display font-bold text-primary">
            Authentication Error
          </h1>
          <p className="text-secondary font-ui">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage