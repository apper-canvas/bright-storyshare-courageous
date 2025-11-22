import React, { useEffect } from "react";

const PromptPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showPromptPassword('#authentication-prompt-password');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-primary mb-2">
              Complete Registration
            </h1>
            <p className="text-secondary font-ui">
              Please set your password to complete registration
            </p>
          </div>
          
          <div id="authentication-prompt-password" className="bg-white rounded-lg shadow-card p-6"></div>
        </div>
      </div>
    </div>
  );
};

export default PromptPassword;