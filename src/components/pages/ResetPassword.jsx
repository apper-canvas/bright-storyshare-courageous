import React, { useEffect } from 'react'

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    if (ApperUI) {
      ApperUI.showResetPassword('#authentication-reset-password');
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div id="authentication-reset-password"></div>
      </div>
    </div>
  )
}

export default ResetPassword