import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/layouts/Root";

function Signup() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const { isInitialized } = useAuth()

  // Initialize ApperUI signup when component mounts and auth is ready
  useEffect(() => {
    if (isInitialized && !user) {
      // Wait a bit for DOM to be ready
      const timer = setTimeout(() => {
        if (window.ApperSDK?.ApperUI) {
          window.ApperSDK.ApperUI.showSignup("#authentication")
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isInitialized, user])

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Join StoryShare</h1>
          <p className="text-secondary font-ui">Create your account to start sharing stories</p>
        </div>
        
        <div id="authentication" className="bg-white rounded-xl shadow-card p-8 border border-surface">
          {/* ApperUI will render signup form here */}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-secondary font-ui">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup