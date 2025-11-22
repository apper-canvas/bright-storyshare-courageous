import React, { useEffect } from 'react'

const ResetPassword = () => {
  useEffect(() => {
    if (window.ApperSDK?.ApperUI) {
      window.ApperSDK.ApperUI.showResetPassword('#authentication-reset-password')
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Reset Password</h1>
          <p className="text-secondary font-ui">Enter your email to reset your password</p>
        </div>
        
        <div id="authentication-reset-password" className="bg-white rounded-xl shadow-card p-8 border border-surface">
          {/* ApperUI will render reset password form here */}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword