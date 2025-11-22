import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";

const Signup = () => {
  const { user } = useSelector((state) => state.user);
  const { isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && user) {
      // User is already authenticated, redirect
      navigate('/');
      return;
    }

    if (isInitialized && !user) {
      // Show signup UI
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication");
    }
  }, [isInitialized, user, navigate]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Join StoryShare
            </h1>
            <p className="text-secondary font-ui">
              Create an account to start sharing your stories
            </p>
          </div>
          
          <div id="authentication" className="bg-white rounded-lg shadow-card p-6"></div>
          
          <div className="text-center mt-6">
            <p className="text-secondary font-ui">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-accent hover:underline font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;