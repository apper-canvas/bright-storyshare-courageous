import React from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const errorMessage = searchParams.get("message") || "An unexpected error occurred"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={32} className="text-error" />
            </div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Authentication Error
            </h1>
            <p className="text-secondary font-ui mb-6">
              {errorMessage}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <div className="space-y-4">
              <Button
                variant="primary"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage