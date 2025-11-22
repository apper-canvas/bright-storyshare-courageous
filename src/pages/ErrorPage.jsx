import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const errorMessage = searchParams.get('message') || 'An authentication error occurred';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={48} className="text-error" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-display font-bold text-primary">
            Authentication Error
          </h1>
          <p className="text-secondary font-ui leading-relaxed">
            {errorMessage}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            className="w-full inline-flex items-center justify-center gap-2"
          >
            <ApperIcon name="LogIn" size={16} />
            Try Again
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            className="w-full inline-flex items-center justify-center gap-2"
          >
            <ApperIcon name="Home" size={16} />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;