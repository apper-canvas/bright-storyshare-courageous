import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center">
            <ApperIcon name="BookOpen" size={48} className="text-secondary" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-primary">
            Story Not Found
          </h1>
          
          <p className="text-lg text-secondary font-ui">
            The page you're looking for seems to have wandered off into another chapter.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="w-full"
          >
            <ApperIcon name="Home" size={16} className="mr-2" />
            Return Home
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="w-full"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Go Back
          </Button>
        </div>

        <div className="pt-8 border-t border-surface">
          <p className="text-sm text-secondary font-ui">
            Lost? Try searching for stories or explore our{" "}
            <button
              onClick={() => navigate('/')}
              className="text-accent hover:text-accent/80 font-medium underline"
            >
              discover page
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound