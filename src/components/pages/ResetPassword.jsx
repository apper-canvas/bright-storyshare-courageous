import React, { useEffect } from 'react'

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showResetPassword('#authentication-reset-password')
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-primary">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-secondary font-ui">
            Enter your new password below
          </p>
        </div>
        
        <div id="authentication-reset-password" className="mt-8"></div>
      </div>
    </div>
  )
}

export default ResetPassword