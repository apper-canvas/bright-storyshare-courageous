import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/layouts/Root"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Login = () => {
  const navigate = useNavigate()
  const { isInitialized, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search)
      const redirectPath = urlParams.get("redirect")
      navigate(redirectPath || "/")
    }
  }, [isInitialized, isAuthenticated, navigate])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showLogin("#authentication")
    }
  }, [isInitialized, isAuthenticated])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-primary mb-2">
              Welcome Back
            </h1>
            <p className="text-secondary font-ui">
              Sign in to continue your reading journey
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-8">
            <div id="authentication"></div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary font-ui">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-accent font-medium hover:text-accent/80 transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login