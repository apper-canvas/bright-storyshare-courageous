import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isInitialized } = useSelector((state) => state.user);

  useEffect(() => {
    if (isInitialized && user) {
      // User is already logged in, redirect
      const redirectPath = searchParams.get('redirect') || '/discover';
      navigate(redirectPath, { replace: true });
      return;
    }

    // Show login form if initialized and no user
    if (isInitialized && !user) {
      if (window.ApperSDK?.ApperUI) {
        window.ApperSDK.ApperUI.showLogin('#authentication');
      }
    }
  }, [isInitialized, user, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-secondary font-ui">
            Sign in to your account to continue reading and writing stories
          </p>
        </div>
        
        <div id="authentication" className="mt-8"></div>
        
        <div className="text-center">
          <p className="text-sm text-secondary font-ui">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:text-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;