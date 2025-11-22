import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isInitialized } = useSelector(state => state.user)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isInitialized && user) {
      const redirectPath = searchParams.get('redirect') || '/'
      navigate(redirectPath)
      return
    }
  }, [isInitialized, user, navigate, searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email')
      return
    }
    
    if (!formData.password) {
      toast.error('Please enter a password')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    
    try {
      // TODO: Implement actual signup logic when authentication service is available
      console.log('Signup attempt:', { name: formData.name, email: formData.email })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Account created successfully! Please sign in.')
      
      // Redirect to login with redirect parameter preserved
      const redirectParam = searchParams.get('redirect')
      navigate('/login' + (redirectParam ? `?redirect=${redirectParam}` : ''))
      
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name="BookOpen" size={32} className="text-accent" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-primary">
            Join StoryShare
          </h1>
          
          <p className="text-secondary font-ui">
            Create an account to start writing and sharing your stories
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary font-ui mb-2">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary font-ui mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary font-ui mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a secure password"
                className="w-full"
                required
              />
              <p className="text-xs text-secondary font-ui mt-1">
                Password must be at least 6 characters long
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-secondary font-ui">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login' + (searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''))}
              className="text-accent hover:text-accent/80 font-medium"
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