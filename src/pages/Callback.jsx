import React, { useEffect } from "react";

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSSOVerify("#authentication-callback");
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-primary mb-2">
              Verifying Authentication
            </h1>
            <p className="text-secondary font-ui">
              Please wait while we complete your sign-in process...
            </p>
          </div>
          
          <div id="authentication-callback" className="bg-white rounded-lg shadow-card p-6"></div>
        </div>
      </div>
    </div>
  );
};

export default Callback;