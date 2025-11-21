import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="BookOpen" size={48} className="text-accent" />
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center">
            <ApperIcon name="X" size={24} className="text-error" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-display font-bold text-primary">404</h1>
          <h2 className="text-2xl font-display font-semibold text-primary">
            Chapter Not Found
          </h2>
          <p className="text-secondary font-ui leading-relaxed">
            The story you're looking for seems to have wandered off into an unexplored chapter. 
            Let's get you back to familiar territory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Home" size={16} />
            Back to Stories
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Go Back
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="pt-8 border-t border-surface">
          <p className="text-sm text-secondary font-ui mb-4">
            Looking for something specific?
          </p>
          <Button
            onClick={() => navigate("/?search=")}
            variant="ghost"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Search" size={16} />
            Search Stories
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound