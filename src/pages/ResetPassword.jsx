import React, { useEffect } from "react";

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showResetPassword('#authentication-reset-password');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-primary mb-2">
              Reset Password
            </h1>
            <p className="text-secondary font-ui">
              Enter your new password below
            </p>
          </div>
          
          <div id="authentication-reset-password" className="bg-white rounded-lg shadow-card p-6"></div>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;